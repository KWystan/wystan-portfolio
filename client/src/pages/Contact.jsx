import { useState } from 'react';
import { contact } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to send');
      setStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const [ref, visible] = useScrollReveal();

  return (
    <section className="py-8 md:py-10">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-display text-lg font-semibold tracking-tight text-black mb-1">
          {contact.headline || "Let's work together"}
        </h2>
        <p className="text-sm text-black/55 mb-6 max-w-xl">
          {contact.availability}
        </p>

        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ── Contact form ───────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-black/55 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white text-black text-sm rounded-lg px-3 py-2.5 border border-black/10 focus:border-black/25 outline-none transition-all duration-150 placeholder:text-black/25"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-black/55 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white text-black text-sm rounded-lg px-3 py-2.5 border border-black/10 focus:border-black/25 outline-none transition-all duration-150 placeholder:text-black/25"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-medium text-black/55 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-white text-black text-sm rounded-lg px-3 py-2.5 border border-black/10 focus:border-black/25 outline-none transition-all duration-150"
                >
                  <option value="">Select a subject</option>
                  {contact.subjects?.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  )) || (
                    <>
                      <option value="Freelance Project">Freelance Project</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Job Opportunity">Job Opportunity</option>
                      <option value="Just Saying Hi">Just Saying Hi</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-medium text-black/55 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full bg-white text-black text-sm rounded-lg px-3 py-2.5 border border-black/10 focus:border-black/25 outline-none transition-all duration-150 placeholder:text-black/25 resize-y"
                  placeholder="Tell me about your project, idea, or just say hello..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-black/18 text-black font-medium text-sm hover-gate:border-black/40 active:scale-[0.97] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <>
                    <span className="inline-block size-3.5 border-2 border-black/20 border-t-black/60 rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">send</span>
                    Send Message
                  </>
                )}
              </button>

              {status === 'sent' && (
                <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Message sent! I'll get back to you within 24 hours.
                </p>
              )}

              {status === 'error' && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  Something went wrong. Please try again or email me directly.
                </p>
              )}
            </form>

            {/* ── Contact info ────────────────────────────────── */}
            <div className="space-y-4">
              <div className="border border-black/10 rounded-lg p-4 transition-all duration-200">
                <h3 className="text-xs font-semibold text-black mb-3">Get in touch</h3>
                <div className="space-y-3">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2.5 text-sm text-black/55 hover-gate:text-black/80 transition-colors duration-150"
                  >
                    <span className="material-symbols-outlined text-[16px] text-black/40">mail</span>
                    {contact.email}
                  </a>

                  <a
                    href="https://github.com/KWystan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-black/55 hover-gate:text-black/80 transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 text-black/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    @KWystan
                  </a>

                  <div className="flex items-center gap-2.5 text-sm text-black/55">
                    <span className="material-symbols-outlined text-[16px] text-black/40">schedule</span>
                    {contact.responseTime || 'Usually responds within 24 hours'}
                  </div>
                </div>
              </div>

              <div className="border border-black/10 rounded-lg p-4 transition-all duration-200">
                <h3 className="text-xs font-semibold text-black mb-2">Prefer email?</h3>
                <p className="text-xs text-black/55 leading-relaxed">
                  Feel free to send me an email directly at{' '}
                  <a href={`mailto:${contact.email}`} className="underline underline-offset-2 text-black/65 hover:text-black transition-colors duration-150">
                    {contact.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
