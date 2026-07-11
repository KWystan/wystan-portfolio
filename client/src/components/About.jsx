import { about } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

export default function About() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="about" className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-magazine text-lg font-semibold tracking-tight text-black mb-4">
          About
        </h2>
        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''}`}
        >
          <div className="max-w-3xl space-y-3">
            {about.map((text, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-4 h-4 rounded-full border border-black/20 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <p className="text-sm leading-relaxed text-black/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
