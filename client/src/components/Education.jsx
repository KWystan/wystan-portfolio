import { useState } from 'react';
import { education } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

function EducationCard({ edu }) {
  return (
    <div className="border border-black/10 rounded-lg p-4 transition-all duration-200 hover-gate:border-black/20 active:scale-[0.99]">
      <div className="flex items-start gap-3 mb-3">
        {edu.image && (
          <div className="w-10 h-10 rounded-lg border border-black/18 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={edu.image} alt={edu.school} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-black">{edu.degree}</h3>
          <p className="text-xs text-black/55">{edu.school}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-xs text-black/40">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[11px] text-black/40">calendar_today</span>
          {edu.period}
        </span>
        <span className="text-black/15">·</span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[11px] text-black/40">location_on</span>
          {edu.location}
        </span>
      </div>

      <ul className="space-y-1.5">
        {edu.details.map((detail, j) => (
          <li key={j} className="flex items-start gap-2 text-xs text-black/55">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-black/20 flex-shrink-0" />
            {detail}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Education() {
  const [ref, visible] = useScrollReveal();
  const [showMore, setShowMore] = useState(false);

  const [university, highSchool] = education;

  return (
    <section id="education" className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-sans text-lg font-semibold tracking-tight text-black mb-4">
          Education
        </h2>

        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''} space-y-3`}
        >
          {/* University — always visible */}
          <EducationCard edu={university} />

          {/* High school — hidden by default, expands on toggle */}
          {showMore && (
            <div className="animate-scale-in">
              <EducationCard edu={highSchool} />
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-black/40 hover:text-black/70 transition-colors duration-200 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[14px] transition-transform duration-200"
              style={{ transform: showMore ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              expand_more
            </span>
            {showMore ? 'Less' : 'More'}
          </button>
        </div>
      </div>
    </section>
  );
}
