import { GitHubCalendar } from 'react-github-calendar';
import useScrollReveal from '../hooks/useScrollReveal';

/* ── Grey-on-white theme to match the portfolio's monochrome aesthetic ── */
const theme = {
  light: ['#f3f3f3', '#d9d9d9', '#a3a3a3', '#525252', '#171717'],
};

const labels = {
  totalCount: '{{count}} contributions in the last year',
};

const tooltips = {
  activity: {
    text: (activity) =>
      `${activity.count} contribution${activity.count !== 1 ? 's' : ''} on ${new Date(activity.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`,
    placement: 'top',
    withArrow: true,
    hoverRestMs: 200,
  },
};

export default function Contributions() {
  const [ref, visible] = useScrollReveal();

  return (
    <section className="py-8 md:py-10 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 border-l border-black/7 border-line-animate">
        <h2 className="font-magazine text-lg font-semibold tracking-tight text-black mb-4">
          GitHub Activity
        </h2>

        <div
          ref={ref}
          className={`scroll-reveal ${visible ? 'revealed' : ''}`}
        >
          <div className="border border-black/10 rounded-lg p-4 md:p-6 overflow-x-auto">
            <GitHubCalendar
              username="KWystan"
              year="last"
              theme={theme}
              labels={labels}
              tooltips={tooltips}
              fontSize={13}
              blockSize={12}
              blockMargin={4}
              blockRadius={2}
              colorScheme="light"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
