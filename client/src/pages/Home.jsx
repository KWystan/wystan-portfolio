import Hero from '../components/Hero';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 lg:py-12">
      <Hero />

      <section className="mt-12 border-t border-black/6 border-line-animate">
        <div className="border-l border-black/7 border-line-animate pt-8">
          <h2 className="font-display text-lg font-semibold tracking-tight text-black mb-3">
            Quick Overview
          </h2>
          <p className="text-sm text-black/60 leading-relaxed max-w-2xl font-serif">
            I'm a third-year BSIT student at West Visayas State University — CICT, passionate about web development, networking, and building clean, functional interfaces. Welcome to my corner of the web.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href="/about"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black/15 text-xs font-medium text-black/65 hover-gate:border-black/35 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
            >
              More about me
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </a>
            <a
              href="/projects"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black/15 text-xs font-medium text-black/65 hover-gate:border-black/35 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
            >
              View projects
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
