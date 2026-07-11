export default function Footer() {
  return (
    <footer className="py-6 border-t border-black/6 border-line-animate">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between border-l border-black/7 border-line-animate">
        <span className="text-xs text-black/35">
          &copy; {new Date().getFullYear()} Wystan
        </span>
        <span className="text-xs text-black/35">React, Tailwind, Node, Express, Vite</span>
      </div>
    </footer>
  );
}
