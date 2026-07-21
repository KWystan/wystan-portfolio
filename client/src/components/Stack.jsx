import {
  SiReact, SiJavascript, SiNodedotjs, SiExpress,
  SiTailwindcss, SiHtml5, SiCss, SiPython,
  SiLinux, SiGit, SiMysql, SiMongodb,
  SiDocker, SiFigma, SiCisco, SiFirebase,
  SiXampp, SiVercel, SiGithub, SiCanva,
  SiInsomnia, SiSublimetext, SiAndroidstudio,
} from 'react-icons/si';
import { stack, stackDetails } from '../data/portfolioData';
import { useState, useRef, useEffect } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import huggingFaceLogo from '../assets/huggingface_logo-noborder.svg';
import namecheapLogo from '../assets/namecheap.png';
import packetTracerLogo from '../assets/packettracer.png';

const iconMap = {
  'React':      SiReact,
  'JavaScript': SiJavascript,
  'Node.js':    SiNodedotjs,
  'Express.js': SiExpress,
  'Tailwind CSS': SiTailwindcss,
  'HTML':       SiHtml5,
  'CSS':        SiCss,
  'Python':     SiPython,
  'Networking':  null,
  'Linux':      SiLinux,
  'Git':        SiGit,
  'MySQL':      SiMysql,
  'MongoDB':    SiMongodb,
  'Docker':     SiDocker,
  'Figma':      SiFigma,
  'Cisco':      SiCisco,
  'Firestore':  SiFirebase,
  'XAMPP':      SiXampp,
  'Vercel':     SiVercel,
  'GitHub':     SiGithub,
  'Canva':          SiCanva,
  'Insomnia':       SiInsomnia,
  'Sublime Text':   SiSublimetext,
  'Android Studio': SiAndroidstudio,
};

const brandColors = {
  'React':      '#61DAFB',
  'JavaScript': '#F7DF1E',
  'Node.js':    '#339933',
  'Express.js': '#000000',
  'Tailwind CSS': '#06B6D4',
  'HTML':       '#E34F26',
  'CSS':        '#1572B6',
  'Python':     '#3776AB',
  'Linux':      '#FCC624',
  'Git':        '#F05032',
  'MySQL':      '#4479A1',
  'MongoDB':    '#47A248',
  'Docker':     '#2496ED',
  'Figma':      '#F24E1E',
  'Cisco':      '#1BA0D7',
  'Firestore':  '#FFCA28',
  'XAMPP':      '#FB7A24',
  'Vercel':     '#000000',
  'Hugging Face': '#FFD21E',
  'GitHub':     '#181717',
  'Canva':          '#00C4CC',
  'Insomnia':       '#4000BF',
  'Sublime Text':   '#FF9800',
  'Android Studio': '#3DDC84',
};

function TechIcon({ name, color }) {
  const Icon = iconMap[name];
  if (Icon) return <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />;
  if (name === 'Networking')
    return (
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={color || 'currentColor'} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    );
  if (name === 'Hugging Face')
    return <img src={huggingFaceLogo} alt="Hugging Face" className="w-3.5 h-3.5 shrink-0" />;
  if (name === 'Namecheap')
    return <img src={namecheapLogo} alt="Namecheap" className="w-3.5 h-3.5 shrink-0" />;
  if (name === 'Packet Tracer')
    return <img src={packetTracerLogo} alt="Packet Tracer" className="w-3.5 h-3.5 shrink-0" />;
  if (name === 'Setup Computer Server')
    return (
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={color || 'currentColor'} strokeWidth={1.5}>
        <rect x="4" y="3" width="16" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="8" y1="7.5" x2="16" y2="7.5" strokeLinecap="round" />
        <line x1="8" y1="12" x2="16" y2="12" strokeLinecap="round" />
        <line x1="8" y1="16.5" x2="13" y2="16.5" strokeLinecap="round" />
      </svg>
    );
  if (name === 'Configure Computer Systems and Networks')
    return (
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={color || 'currentColor'} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    );
  if (name === 'Install Computer Systems and Networks')
    return (
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke={color || 'currentColor'} strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    );
  return null;
}

export default function Stack() {
  const [ref, visible] = useScrollReveal();
  const [expanded, setExpanded] = useState({});
  const [overflows, setOverflows] = useState({});
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const tagRefs = useRef({});

  const toggleCategory = (cat) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  /* ── Close detail modal on Escape / lock scroll ──────────── */
  useEffect(() => {
    if (!selectedDetail) return;
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedDetail(null); };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [selectedDetail]);

  /* ── Measure each category's natural height ────────────────── */
  useEffect(() => {
    for (const [cat, el] of Object.entries(tagRefs.current)) {
      if (overflows.hasOwnProperty(cat)) continue;
      el.style.maxHeight = 'none';
      const fullH = el.scrollHeight;
      el.style.maxHeight = '';
      setOverflows((prev) => {
        if (prev.hasOwnProperty(cat)) return prev;
        return { ...prev, [cat]: fullH > 72 };
      });
    }
  });

  return (
    <section className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-display text-lg font-semibold tracking-tight text-black mb-4">
          Stack
        </h2>
        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''}`}
        >
          <div className="space-y-4">
            {Object.entries(stack).slice(0, showAllCategories ? undefined : 2).map(([category, techs]) => {
              const isExpanded = expanded[category];
              return (
                <div key={category}>
                  <h3 className="text-[10px] font-medium tracking-wider uppercase text-black/30 mb-2">
                    {category}
                  </h3>
                  <div
                    ref={(el) => { if (el) tagRefs.current[category] = el; }}
                    className="flex flex-wrap gap-2 overflow-hidden transition-all duration-400"
                    style={{
                      maxHeight: isExpanded ? 'none' : '4.5rem',
                    }}
                  >
                    {techs.map((tech) => {
                      const hasDetail = stackDetails[tech];
                      return (
                        <span
                          key={tech}
                          onClick={hasDetail ? () => setSelectedDetail(tech) : undefined}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-black/15 text-black/60 transition-all duration-150 hover-gate:border-black/35 hover-gate:text-black/85 active:scale-[0.97] ${hasDetail ? 'cursor-pointer' : ''}`}
                        >
                          <TechIcon name={tech} color={brandColors[tech]} />
                          {tech}
                        </span>
                      );
                    })}
                  </div>
                  {overflows[category] && (
                    <button
                      onClick={() => toggleCategory(category)}
                      className="mt-1.5 text-[10px] text-black/30 hover-gate:text-black/60 active:scale-[0.97] transition-all duration-150 cursor-pointer"
                    >
                      {isExpanded ? 'Show less ↑' : 'Show more ↓'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {Object.keys(stack).length > 2 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="flex items-center gap-1.5 text-xs text-black/40 hover:text-black/70 transition-colors duration-200 cursor-pointer mt-3"
            >
              <span
                className="material-symbols-outlined text-[14px] transition-transform duration-200"
                style={{ transform: showAllCategories ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                expand_more
              </span>
              {showAllCategories ? 'Less' : 'More'}
            </button>
          )}
        </div>
      </div>

      {/* ── Stack Detail Modal ──────────────────────────────────── */}
      {selectedDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/15"
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white border border-black/8 rounded-xl shadow-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: `scale-in 0.25s var(--ease-out-expo) both` }}
          >
            {/* Top accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />

            {/* Close button */}
            <button
              onClick={() => setSelectedDetail(null)}
              className="absolute top-4 right-4 z-10 size-7 rounded-full flex items-center justify-center text-black/25 hover:text-black/60 active:scale-[0.92] transition-all duration-150"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-3 pr-12">
              <div className="size-8 rounded-lg border border-black/12 flex items-center justify-center text-black/50 shrink-0">
                <TechIcon name={selectedDetail} />
              </div>
              <h3 className="font-display text-base font-semibold text-black leading-tight">{selectedDetail}</h3>
            </div>

            {/* Detail items */}
            <div className="px-5 pb-5">
              <div className="space-y-1.5">
                {stackDetails[selectedDetail].map((item, i) => {
                  /* ── Structured object format ─────────── */
                  if (typeof item === 'object') {
                    if (item.type === 'text')
                      return <p key={i} className="text-sm text-black/60 leading-relaxed">{item.content}</p>;
                    if (item.type === 'note')
                      return (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-black/45 italic leading-relaxed">
                          <span className="block w-px min-h-[1.25em] bg-black/10 shrink-0" />
                          {item.content}
                        </div>
                      );
                    if (item.type === 'sep')
                      return <div key={i} className="border-t border-black/6 my-3" />;
                    if (item.type === 'heading')
                      return <h4 key={i} className="text-[10px] font-semibold tracking-widest uppercase text-black/35 mt-3 mb-1.5">{item.content}</h4>;
                    if (item.type === 'bullet')
                      return (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-black/60 leading-relaxed">
                          <span className="block w-1 h-px bg-black/30 mt-[9px] shrink-0" />
                          {item.content}
                        </div>
                      );
                    return null;
                  }
                  /* ── Simple string format (backward compat) ── */
                  return (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-black/60 leading-relaxed">
                      <span className="block w-1 h-px bg-black/30 mt-[9px] shrink-0" />
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
