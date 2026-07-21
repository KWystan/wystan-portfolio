import { useState, useEffect } from 'react';
import { projects } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';
import {
  SiReact, SiTailwindcss, SiVite, SiNodedotjs, SiExpress,
  SiMongodb, SiJavascript, SiCisco, SiFirebase,
} from 'react-icons/si';

const INITIAL_SHOW = 4;

const techIcons = {
  React: { Icon: SiReact, color: '#61DAFB' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#06B6D4' },
  Vite: { Icon: SiVite, color: '#646CFF' },
  'Node.js': { Icon: SiNodedotjs, color: '#5FA04E' },
  'Express.js': { Icon: SiExpress, color: '#000000' },
  MongoDB: { Icon: SiMongodb, color: '#47A248' },
  JavaScript: { Icon: SiJavascript, color: '#F7DF1E' },
  Cisco: { Icon: SiCisco, color: '#1BA0D7' },
  Firebase: { Icon: SiFirebase, color: '#FFCA28' },
};

export default function Projects() {
  const [showAll, setShowAll] = useState(false);
  const [modal, setModal] = useState(null); // { projectIndex, slide } | null
  const [revealRef, revealed] = useScrollReveal();
  const visible = showAll ? projects : projects.slice(0, INITIAL_SHOW);

  /* ── Modal keyboard & scroll lock ──────────────────────── */
  useEffect(() => {
    if (!modal) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setModal(null);
      const project = projects[modal.projectIndex];
      const snippets = project.snippets;
      if (!snippets || snippets.length < 2) return;
      if (e.key === 'ArrowLeft') setModal(prev => ({ ...prev, slide: (prev.slide - 1 + snippets.length) % snippets.length }));
      if (e.key === 'ArrowRight') setModal(prev => ({ ...prev, slide: (prev.slide + 1) % snippets.length }));
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [modal]);

  return (
    <section id="projects" className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-display text-lg font-semibold tracking-tight text-black mb-4">
          Projects <span className="text-black/35 text-base font-normal">[{projects.length}]</span>
        </h2>

        <div
          ref={revealRef}
          className={`scroll-reveal ${revealed ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {visible.map((project, i) => (
              <div
                key={project.title}
                className="group border border-black/10 rounded-lg overflow-hidden transition-all duration-200 hover-gate:border-black/25 active:scale-[0.99] flex flex-col"
              >
              {/* ── Thumbnail ──────────────────────────────────── */}
              <div className="h-24 shrink-0 bg-white border-b border-black/8 overflow-hidden cursor-pointer"
                onClick={() => project.snippets && setModal({ projectIndex: i, slide: 0 })}
              >
                {project.snippets ? (
                  <div className="flex w-full h-full">
                    {project.snippets.map((src, si) => (
                      <img
                        key={si}
                        src={src}
                        alt={`${project.title} ${si + 1}`}
                        className="w-1/3 h-full object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-black/8 text-4xl font-bold select-none tracking-tight">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>

              {/* ── Content ──────────────────────────────────── */}
              <div className="flex flex-col flex-1 p-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-black">{project.title}</h3>
                  <span className="text-[10px] text-black/35 whitespace-nowrap mt-0.5">{project.period}</span>
                </div>

                <p className="text-xs text-black/55 leading-relaxed mb-3 flex-1">{project.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.techs.map((tech) => {
                    const mapped = techIcons[tech];
                    return (
                      <span key={tech} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-black/10 text-black/45">
                        {mapped && <mapped.Icon className="size-3" style={{ color: mapped.color }} />}
                        {tech}
                      </span>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[10px] text-black/45 font-medium truncate min-w-0">
                    {project.result}
                  </span>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium px-2 py-1 rounded border border-black/15 text-black/65 hover-gate:border-black/35 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
                  >
                    View Project
                  </a>
                </div>
              </div>
              </div>
            ))}
          </div>

          {projects.length > INITIAL_SHOW && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-black/45 hover-gate:text-black active:scale-[0.97] transition-all duration-150 px-4 py-1.5 rounded border border-black/10 hover-gate:border-black/25 cursor-pointer"
              >
                {showAll ? 'Show Less' : `Show More (${projects.length - INITIAL_SHOW} more)`}
              </button>
            </div>
          )}
        </div>

        {/* ── Snippet Modal ───────────────────────────────────── */}
        {modal && (() => {
          const project = projects[modal.projectIndex];
          const snippets = project.snippets;
          if (!snippets) return null;
          const slide = modal.slide;
          const hasMultiple = snippets.length > 1;

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={() => setModal(null)}
              style={{
                animation: `fade-up 0.2s var(--ease-out-expo) both`,
                background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,0.9) 100%)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
              }}
            >
              {/* ── Close button ──────────────────────────── */}
              <button
                onClick={() => setModal(null)}
                className="absolute top-5 right-5 z-20 h-9 px-3.5 rounded-2xl border border-black/10 bg-white/75 backdrop-blur-md flex items-center gap-2 text-black/50 hover-gate:text-black hover-gate:border-black/25 active:scale-[0.97] transition-all duration-150 shadow-xs group"
                aria-label="Close"
              >
                <span className="text-[10px] font-medium tracking-wide uppercase">Esc</span>
                <span className="w-px h-3.5 bg-black/8" />
                <span className="material-symbols-outlined text-[12px]">close</span>
              </button>

              {/* ── Counter badge ──────────────────────────── */}
              {hasMultiple && (
                <span className="absolute top-4 left-4 z-20 text-[11px] font-mono tabular-nums text-black/40 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-2xl border border-black/8">
                  {String(slide + 1).padStart(2, '0')} / {String(snippets.length).padStart(2, '0')}
                </span>
              )}

              {/* ── Image ──────────────────────────────────── */}
              <div
                className="relative flex items-center justify-center w-full h-full p-8 md:p-16"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  key={slide}
                  src={snippets[slide]}
                  alt={`${project.title} screenshot ${slide + 1}`}
                  className="max-w-full max-h-full w-auto h-auto object-contain select-none pointer-events-none"
                  style={{ animation: `scale-in 0.3s var(--ease-out-expo) both` }}
                  draggable={false}
                />

                {/* ── Left arrow ────────────────────────────── */}
                {hasMultiple && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setModal(prev => ({ ...prev, slide: (prev.slide - 1 + snippets.length) % snippets.length })); }}
                    className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-black/8 bg-white/70 backdrop-blur-md flex items-center justify-center text-black/45 hover-gate:text-black hover-gate:border-black/20 active:scale-90 transition-all duration-150 shadow-xs z-10"
                    aria-label="Previous"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                )}

                {/* ── Right arrow ───────────────────────────── */}
                {hasMultiple && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setModal(prev => ({ ...prev, slide: (prev.slide + 1) % snippets.length })); }}
                    className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-black/8 bg-white/70 backdrop-blur-md flex items-center justify-center text-black/45 hover-gate:text-black hover-gate:border-black/20 active:scale-90 transition-all duration-150 shadow-xs z-10"
                    aria-label="Next"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                )}
              </div>

              {/* ── Bottom bar ──────────────────────────────── */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/70 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-black/8 shadow-xs">
                {hasMultiple && (
                  <div className="flex gap-2">
                    {snippets.map((_, si) => (
                      <button
                        key={si}
                        onClick={(e) => { e.stopPropagation(); setModal(prev => ({ ...prev, slide: si })); }}
                        className={`block rounded-full transition-all duration-200 ${
                          si === slide
                            ? 'w-5 h-2 bg-black'
                            : 'w-2 h-2 bg-black/15 hover:bg-black/30'
                        }`}
                        aria-label={`Go to slide ${si + 1}`}
                      />
                    ))}
                  </div>
                )}
                <div className="w-px h-4 bg-black/8" />
                <span className="text-xs text-black/60 font-medium truncate max-w-[160px]">
                  {project.title}
                </span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-medium px-3.5 py-1.5 rounded-xl border border-black/12 text-black/55 hover-gate:text-black hover-gate:border-black/30 active:scale-[0.97] transition-all duration-150"
                >
                  Visit Site
                </a>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
