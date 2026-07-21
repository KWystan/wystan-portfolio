import { cta } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

export default function CTA() {
  const [ref, visible] = useScrollReveal();

  return (
    <section className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 text-center border-l border-black/7 border-line-animate">
        <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-black mb-2">
          {cta.headline}
        </h2>
        <p
          className="text-sm text-black/55 max-w-lg mx-auto mb-5"
        >
          {cta.availability}
        </p>
        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''}`}
        >
          <a
            href={`mailto:${cta.email}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-black/18 text-black font-medium text-sm hover-gate:border-black/40 active:scale-[0.97] transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[14px]">mail</span>
            {cta.email}
          </a>
        </div>
      </div>
    </section>
  );
}
