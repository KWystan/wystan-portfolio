import { useState, useEffect } from 'react';
import { certifications } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

const INITIAL_SHOW = 4;

export default function Certifications() {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);
  const [ref, visible] = useScrollReveal();
  const visibleCerts = showAll ? certifications : certifications.slice(0, INITIAL_SHOW);

  /* ── Close modal on Escape / lock body scroll ──────────── */
  useEffect(() => {
    if (!selected) return;
    const handleEsc = (e) => { if (e.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <section id="certifications" className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-magazine text-lg font-semibold tracking-tight text-black mb-4">
          Certifications <span className="text-black/35 text-base font-normal">[{certifications.length}]</span>
        </h2>

        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleCerts.map((cert, i) => (
              <div
                key={cert.title}
                className="border border-black/10 rounded-lg h-20 transition-all duration-200 hover-gate:border-black/25 active:scale-[0.99] cursor-pointer"
                onClick={() => setSelected(cert)}
              >
                <div className="flex items-stretch gap-0 p-3 h-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0 pr-2 pointer-events-none">
                    <div className="h-11 w-auto min-w-[36px] aspect-square rounded-lg border border-black/18 overflow-hidden flex-shrink-0">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 overflow-hidden">
                      <h3 className="text-sm font-semibold text-black truncate">{cert.title}</h3>
                      <p className="text-xs text-black/55 truncate">{cert.issuer}</p>
                      {cert.subtitle && (
                        <p className="text-[10px] text-black/40 truncate">{cert.subtitle}</p>
                      )}
                      <p className="text-[10px] text-black/35 truncate">{cert.date}</p>
                    </div>
                  </div>

                  {cert.link && <div className="w-px bg-black/8 self-stretch" />}

                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center shrink-0 pl-2 text-black/40 hover-gate:text-black active:scale-[0.97] transition-all duration-150 pointer-events-auto"
                      aria-label={cert.linkLabel || 'View Certificate'}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {certifications.length > INITIAL_SHOW && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-black/45 hover-gate:text-black active:scale-[0.97] transition-all duration-150 px-4 py-1.5 rounded border border-black/10 hover-gate:border-black/25 cursor-pointer"
              >
                {showAll ? 'Show Less' : `Show More (${certifications.length - INITIAL_SHOW} more)`}
              </button>
            </div>
          )}
        </div>

        {/* ── Certificate Modal ──────────────────────────────── */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl border border-black/10 shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full border border-black/12 bg-white flex items-center justify-center text-black/55 hover-gate:text-black hover-gate:border-black/30 active:scale-[0.92] transition-all duration-150"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>

              <div className="flex items-center justify-center p-6">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg"
                />
              </div>

              <div className="border-t border-black/8 px-6 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-black truncate">{selected.title}</p>
                  <p className="text-xs text-black/55">{selected.issuer}</p>
                </div>
                {selected.link && (
                  <a
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 ml-4 text-xs font-medium px-3 py-1.5 rounded border border-black/15 text-black/65 hover-gate:border-black/35 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
                  >
                    View on Credly
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
