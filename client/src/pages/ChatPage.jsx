import { useState, useEffect, useRef, useCallback } from 'react';
import logo from '../assets/logo.png';

const MODELS = [
  { id: 'mimo-v2.5-free', name: 'MiMo-V2.5' },
  { id: 'nemotron-3-ultra-free', name: 'Nemotron 3 Ultra' },
  { id: 'north-mini-code-free', name: 'North Mini Code' },
];

const SUGGESTIONS = [
  'Explain quantum computing simply',
  'Write a short poem about the ocean',
  'Help me plan a weekend project',
  'What are the best practices for REST APIs?',
];

function renderMessageText(text) {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).replace(/^\w+\n/, '');
      return (
        <pre key={i} className="bg-black/5 border border-black/8 rounded-lg px-3 py-2.5 my-2 overflow-x-auto text-[13px] leading-relaxed font-mono text-black/75 whitespace-pre-wrap">
          <code>{code}</code>
        </pre>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-black/5 border border-black/8 rounded px-1.5 py-0.5 text-[13px] font-mono text-black/70">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortRef = useRef(null);

  /* ── Auto-scroll ──────────────────────────────────────────── */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  /* ── Auto-resize textarea ─────────────────────────────────── */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [input]);

  /* ── Send message with streaming ──────────────────────────── */
  const handleSend = useCallback(async (overrideText) => {
    const text = (overrideText || input).trim();
    if (!text || isLoading) return;

    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch('/api/chat-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, model: selectedModel }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get response');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let buffer = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

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
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            const content = parsed.choices?.[0]?.delta?.content || parsed.content || '';
            if (content) {
              assistantText += content;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: 'assistant', content: assistantText };
                return next;
              });
            }
          } catch (e) {
            if (e.message && !e.message.includes('JSON')) throw e;
          }
        }
      }

      if (!assistantText) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: 'No response received. Please try again.' };
          return next;
        });
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
      setMessages((prev) => prev.filter((_, i) => i !== prev.length - 1 || prev[i].content !== ''));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [input, isLoading, messages]);

  /* ── Keyboard: Enter to send, Shift+Enter newline ─────────── */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    if (isLoading) abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setSidebarOpen(false);
  };

  /* ── Edit: load last user msg back, trim history ──────────── */
  const handleEdit = (idx) => {
    if (isLoading) return;
    setInput(messages[idx].content);
    setMessages((prev) => prev.slice(0, idx));
    textareaRef.current?.focus();
  };

  /* ── Copy assistant message to clipboard ───────────────────── */
  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* ── Sidebar ────────────────────────────────────────────── */}
      {/* Desktop: always visible. Mobile: toggle via button. */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-60 bg-white flex flex-col border-r border-black/8
          transition-transform duration-200 ease-[var(--ease-out-expo)]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* ── Sidebar header ──────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <span className="w-7 h-7 rounded overflow-hidden flex-shrink-0">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </span>
            <span className="text-sm font-medium text-black/70 group-hover-gate:text-black transition-colors duration-150">
              Wystan
            </span>
          </a>
          {/* Mobile close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center text-black/40 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* ── New chat ────────────────────────────────────────── */}
        <div className="px-3">
          <button
            onClick={handleClear}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-black/55 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New chat
          </button>
        </div>

        {/* ── Spacer ──────────────────────────────────────────── */}
        <div className="flex-1" />

        {/* ── Sidebar footer ──────────────────────────────────── */}
        <div className="px-3 pb-4 space-y-1">
          <a
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-black/40 hover-gate:text-black/70 hover-gate:bg-black/5 transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to portfolio
          </a>
        </div>
      </aside>

      {/* ── Mobile overlay ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main area ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ── Top bar ──────────────────────────────────────────── */}
        <header className="flex-shrink-0 bg-white/90 backdrop-blur-md">
          <div className="px-4 h-12 flex items-center gap-3">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-8 h-8 rounded-lg border border-black/12 flex items-center justify-center text-black/50 hover-gate:border-black/35 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
              aria-label="Open sidebar"
            >
              <span className="material-symbols-outlined text-[18px]">menu</span>
            </button>
            {/* ── Model dropdown ────────────────────────────────── */}
            <div className="relative">
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-1 text-sm font-medium text-black/60 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
              >
                {MODELS.find((m) => m.id === selectedModel)?.name}
                <span className="material-symbols-outlined text-[14px] text-black/35">expand_more</span>
              </button>
              {modelDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setModelDropdownOpen(false)} />
                  <div
                    className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-black/10 rounded-xl shadow-lg overflow-hidden z-50"
                    style={{ animation: `scale-in 0.15s var(--ease-out-expo) both`, transformOrigin: 'top left' }}
                  >
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedModel(m.id); setModelDropdownOpen(false); }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors duration-150 flex items-center justify-between ${
                          m.id === selectedModel
                            ? 'bg-black/5 text-black font-medium'
                            : 'text-black/55 hover-gate:text-black hover-gate:bg-black/[0.03]'
                        }`}
                      >
                        {m.name}
                        {m.id === selectedModel && (
                          <span className="material-symbols-outlined text-[14px] text-black/40">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Messages ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {messages.length === 0 ? (
              /* ── Welcome screen ─────────────────────────────────── */
              <div
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
                style={{ animation: 'fade-up 0.4s var(--ease-out-expo) both' }}
              >
                <div className="w-14 h-14 rounded-2xl border border-black/10 flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-2xl text-black/30">auto_awesome</span>
                </div>
                <h2 className="font-display text-xl font-semibold text-black mb-1.5">
                  How can I help you?
                </h2>
                <p className="text-sm text-black/40 max-w-sm mb-8">
                  Ask me anything — from coding questions to creative writing to casual conversation.
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-3 py-1.5 rounded-lg border border-black/10 text-xs text-black/50 hover-gate:border-black/25 hover-gate:text-black/80 active:scale-[0.97] transition-all duration-150"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Message list ───────────────────────────────────── */
              <div className="space-y-4">
                {messages.map((msg, i) => {
                  const isLastUserMsg = msg.role === 'user' && i === messages.length - 1;
                  const isAssistant = msg.role === 'assistant';
                  const isStreaming = isAssistant && !msg.content;
                  return (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      style={{ animation: `fade-up 0.2s var(--ease-out-expo) both` }}
                    >
                      {msg.role === 'user' ? (
                        /* ── User message ────────────────────────────── */
                        <div className="max-w-[80%] relative group">
                          <div className="bg-black text-white rounded-2xl rounded-br-md px-4 py-3 pr-10 text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </div>
                          {/* Edit — bottom-right inside bubble, hover only */}
                          {!isLoading && isLastUserMsg && (
                            <button
                              onClick={() => handleEdit(i)}
                              className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-md flex items-center justify-center text-white/50 hover-gate:text-white active:scale-[0.92] transition-all duration-150"
                              aria-label="Edit message"
                            >
                              <span className="material-symbols-outlined text-[14px]">edit</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        /* ── Assistant message ───────────────────────── */
                        <div className="max-w-[80%] flex gap-2.5">
                          <div className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[14px] text-black/30">auto_awesome</span>
                          </div>
                          <div className="relative group">
                            <div className="border border-black/8 rounded-2xl rounded-bl-md px-4 pb-8 pt-3 text-sm leading-relaxed text-black/70 whitespace-pre-wrap">
                              {msg.content ? renderMessageText(msg.content) : (
                                <span className="inline-flex gap-1 py-0.5">
                                  <span className="animate-blink size-1.5 rounded-full bg-black/25" />
                                  <span className="animate-blink size-1.5 rounded-full bg-black/25" style={{ animationDelay: '0.2s' }} />
                                  <span className="animate-blink size-1.5 rounded-full bg-black/25" style={{ animationDelay: '0.4s' }} />
                                </span>
                              )}
                            </div>
                            {/* Copy — bottom-right inside bubble, hover only, finished only */}
                            {msg.content && !isStreaming && (
                              <button
                                onClick={() => handleCopy(msg.content, i)}
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-black/30 hover-gate:text-black/60 hover-gate:bg-black/5 active:scale-[0.92] transition-all duration-150"
                                aria-label="Copy reply"
                              >
                                <span className="material-symbols-outlined text-[13px]">
                                  {copiedIdx === i ? 'check' : 'content_copy'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* ── Error banner ──────────────────────────────────────── */}
        {error && (
          <div className="flex-shrink-0 max-w-3xl mx-auto px-4 pb-2 w-full">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-600">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="underline hover:no-underline ml-2">Dismiss</button>
            </div>
          </div>
        )}

        {/* ── Input ─────────────────────────────────────────────── */}
        <footer className="flex-shrink-0 bg-white/90 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  maxLength={4000}
                  rows={1}
                  disabled={isLoading}
                  className="w-full bg-white text-black text-sm rounded-xl px-4 py-2.5 resize-none overflow-hidden outline-none placeholder:text-black/30 border border-black/10 focus:border-black/25 transition-all duration-150 disabled:opacity-50 leading-relaxed"
                />
              </div>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 active:scale-[0.92] transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-black/85"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
              </button>
            </div>
            <p className="text-center text-[10px] text-black/20 mt-2">
              AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
