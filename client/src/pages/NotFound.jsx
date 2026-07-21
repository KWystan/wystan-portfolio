import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <h1 className="font-display text-5xl font-bold text-black/15 mb-4">404</h1>
        <p className="text-sm text-black/55 mb-6 leading-relaxed">
          This page doesn't exist yet — maybe it's still in the staging environment.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/15 text-xs font-medium text-black/65 hover-gate:border-black/35 hover-gate:text-black active:scale-[0.97] transition-all duration-150"
        >
          <span className="material-symbols-outlined text-[12px]">arrow_back</span>
          Back home
        </Link>
      </div>
    </div>
  );
}
