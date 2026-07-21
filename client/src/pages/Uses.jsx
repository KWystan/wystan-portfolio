import { uses } from '../data/portfolioData';
import useScrollReveal from '../hooks/useScrollReveal';

function UsesCategory({ category, items }) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? 'revealed' : ''}`}
    >
      <h3 className="text-[10px] font-medium tracking-wider uppercase text-black/30 mb-3">
        {category}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between border border-black/10 rounded-lg px-4 py-3 transition-all duration-200 hover-gate:border-black/20"
          >
            <span className="text-sm font-medium text-black">{item.name}</span>
            <span className="text-xs text-black/45 text-right max-w-[60%]">{item.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Uses() {
  return (
    <section className="py-8 md:py-10">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-display text-lg font-semibold tracking-tight text-black mb-1">
          Uses
        </h2>
        <p className="text-sm text-black/55 mb-6 max-w-xl">
          The tools, hardware, and software I use daily for development and design.
        </p>

        <div className="space-y-8">
          {Object.entries(uses).map(([category, items]) => (
            <UsesCategory key={category} category={category} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
}
