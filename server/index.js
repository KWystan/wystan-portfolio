const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '64kb' }));

// ── System prompt loaded from text file ───────────────────────────
const SYSTEM_PROMPT = fs.readFileSync(path.join(__dirname, 'system-prompt.txt'), 'utf8');

// ── NVIDIA NIM API config ───────────────────────────────────────
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const MODEL = 'meta/llama-3.1-8b-instruct';

// ── Chat endpoint ───────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!NVIDIA_API_KEY || NVIDIA_API_KEY === 'nvapi-YOUR_API_KEY_HERE') {
      return res.status(503).json({ error: 'AI chat is not configured yet. Please set the NVIDIA_API_KEY in the server .env file.' });
    }

    /* Keep context short — last 12 messages max */
    const recent = messages.slice(-12);
    const body = {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...recent,
      ],
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.95,
    };

    const nvidiaRes = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!nvidiaRes.ok) {
      const errText = await nvidiaRes.text();
      console.error('NVIDIA API error:', nvidiaRes.status, errText);
      return res.status(502).json({ error: 'AI service returned an error. Please try again.' });
    }

    const data = await nvidiaRes.json();
    const reply = data.choices?.[0]?.message?.content || '';

    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ── General-purpose AI chat (OpenCode Zen / MiMo) ───────────────
const OPENCODE_API_KEY = process.env.OPENCODE_API_KEY;
const OPENCODE_BASE_URL = process.env.OPENCODE_BASE_URL || 'https://opencode.ai/zen/v1';
const CHAT_MODEL = 'mimo-v2.5-free';

const CHAT_SYSTEM_PROMPT = `You are a helpful, friendly, and knowledgeable AI assistant. You can help users with a wide range of topics including answering questions, writing, explaining concepts, brainstorming ideas, coding help, and general conversation.

Guidelines:
- Be conversational, warm, and approachable
- Give clear, concise, and helpful responses
- Use emojis sparingly and naturally where appropriate
- If unsure about something, say so honestly
- Keep responses focused and useful — avoid being overly verbose
- Adapt your tone to match the user's style`;

app.post('/api/chat-full', async (req, res) => {
  try {
    const { messages, model: clientModel } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!OPENCODE_API_KEY) {
      return res.status(503).json({ error: 'AI chat is not configured yet.' });
    }

    const recent = messages.slice(-20);
    const body = {
      model: clientModel || CHAT_MODEL,
      messages: [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
        ...recent,
      ],
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 0.95,
      stream: true,
    };

    const apiRes = await fetch(`${OPENCODE_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENCODE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('OpenCode API error:', apiRes.status, errText);
      return res.status(502).json({ error: 'AI service returned an error. Please try again.' });
    }

    /* ── Stream SSE back to the client ───────────────────────── */
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const reader = apiRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch {
          // skip malformed JSON
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Chat-full error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Connection lost. Please try again.' })}\n\n`);
      res.end();
    }
  }
});

// ── Contact form endpoint ─────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  /* Basic sanitization */
  const sanitize = (str) => str.replace(/[<>]/g, '').trim().slice(0, 2000);

  const entry = {
    name: sanitize(name),
    email: sanitize(email),
    subject: sanitize(subject || 'No subject'),
    message: sanitize(message),
    timestamp: new Date().toISOString(),
  };

  /* Store to a local JSON file */
  const FILE = path.join(__dirname, 'messages.json');
  let messages = [];
  try {
    if (fs.existsSync(FILE)) {
      messages = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    }
  } catch { /* ignore corrupt file */ }

  messages.push(entry);

  try {
    fs.writeFileSync(FILE, JSON.stringify(messages, null, 2), 'utf8');
    console.log(`[contact] New message from ${entry.name} <${entry.email}>`);
    res.json({ success: true, message: 'Message received! I\'ll get back to you soon.' });
  } catch (err) {
    console.error('[contact] Failed to save:', err);
    res.status(500).json({ error: 'Failed to save message. Please try again.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
