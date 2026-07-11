import { useState, useEffect, useRef } from 'react';

const INITIAL_GREETING = {
  role: 'assistant',
  content: 'Hi there! 👋 I\'m Karl\'s AI assistant. Feel free to ask me anything about his work, skills, experience, or projects!',
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /* ── Add greeting on first open ─────────────────────────── */
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([INITIAL_GREETING]);
    }
  }, [open, messages.length]);

  /* ── Auto-scroll to latest message ───────────────────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* ── Send message ────────────────────────────────────────── */
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get response');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Keyboard shortcut: Enter to send, Shift+Enter for newline ─── */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* ── Toggle button ──────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full border border-black/18 bg-white text-black shadow-sm flex items-center justify-center transition-all duration-150 hover-gate:border-black/40 active:scale-[0.92]"
        aria-label="Toggle chat"
      >
        {open ? (
          <span className="material-symbols-outlined text-lg">close</span>
        ) : (
          <span className="material-symbols-outlined text-lg">chat</span>
        )}
      </button>

      {/* ── Chat panel ─────────────────────────────────────── */}
      {open && (
        <div
          className="absolute bottom-14 right-0 w-72 sm:w-80 bg-white border border-black/10 rounded-xl shadow-md overflow-hidden"
          style={{
            transformOrigin: 'bottom right',
            animation: `scale-in 0.25s var(--ease-out-expo) both`,
          }}
        >
          {/* ── Header ───────────────────────────────────── */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-black/8">
            <div className="relative">
              <div className="w-9 h-9 rounded-full border border-black/18 flex items-center justify-center text-black/45 font-bold text-xs">
                KC
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-black/30 border-2 border-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-black">Karl Cabalonga</p>
              <p className="text-[10px] text-black/50">AI Assistant</p>
            </div>
          </div>

          {/* ── Messages ─────────────────────────────────── */}
          <div className="px-4 py-3 min-h-[200px] max-h-[320px] overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: `fade-up 0.25s var(--ease-out-expo) both`, animationDelay: `${i * 30}ms` }}
              >
                <div
                  className={`max-w-[85%] px-3 py-2.5 rounded-lg text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-br-sm'
                      : 'border border-black/12 rounded-bl-sm text-black/65'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* ── Loading indicator ──────────────────────────── */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="border border-black/12 rounded-lg rounded-bl-sm px-3 py-2.5 text-xs text-black/45">
                  <span className="inline-flex gap-1">
                    <span className="animate-blink size-1.5 rounded-full bg-black/30" />
                    <span className="animate-blink size-1.5 rounded-full bg-black/30" style={{ animationDelay: '0.2s' }} />
                    <span className="animate-blink size-1.5 rounded-full bg-black/30" style={{ animationDelay: '0.4s' }} />
                  </span>
                </div>
              </div>
            )}

            {/* ── Error banner ──────────────────────────────── */}
            {error && (
              <div className="flex justify-center">
                <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-[10px] text-red-600 text-center max-w-full">
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="ml-2 underline hover:no-underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input area ────────────────────────────────── */}
          <div className="border-t border-black/8 px-3 py-2.5">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Karl's work..."
                  maxLength={1000}
                  rows={1}
                  disabled={isLoading}
                  className="w-full bg-white text-black text-xs rounded-lg px-3 py-2 resize-none outline-none placeholder:text-black/35 border border-black/10 focus:border-black/25 transition-all duration-150 disabled:opacity-50"
                />
                <span className="absolute -bottom-3.5 right-1 text-[9px] text-black/25">
                  {input.length}/1000
                </span>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-lg border border-black/18 text-black/55 hover-gate:border-black/35 hover-gate:text-black active:scale-[0.92] transition-all duration-150 flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-[12px]">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
