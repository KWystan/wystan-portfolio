import { experience } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Experience() {
  const [ref, visible] = useScrollReveal();

  return (
    <section id="experience" className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-magazine text-lg font-semibold tracking-tight text-black mb-5">
          Experience <span className="text-black/35 text-base font-normal">[{experience.length}]</span>
        </h2>
        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''}`}
        >
          <div className="relative border-l-2 border-black/10 ml-3 pl-5 space-y-5">
            {experience.map((exp, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-black/20" />
                <div className="border border-black/10 rounded-lg p-4 transition-all duration-200 hover-gate:border-black/20 active:scale-[0.99]">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg border border-black/18 flex items-center justify-center text-black/45 font-bold text-xs flex-shrink-0">
                      {exp.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-black">{exp.role}</h3>
                      <p className="text-xs text-black/55">{exp.company}</p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-black/12 text-black/45 whitespace-nowrap">
                      {exp.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 text-xs text-black/40">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px] text-black/40">calendar_today</span>
                      {exp.startDate} — {exp.endDate}
                    </span>
                    <span className="text-black/15">·</span>
                    <span>{exp.duration}</span>
                  </div>

                  <p className="text-xs text-black/55 leading-relaxed mb-3">{exp.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.techs.map((tech) => (
                      <span key={tech} className="text-[10px] px-2 py-0.5 rounded border border-black/10 text-black/45">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
