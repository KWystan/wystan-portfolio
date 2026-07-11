import { useState } from 'react';
import { navLinks } from '../data/portfolioData';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/8">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-black font-semibold text-base">
          <span className="flex items-center justify-center w-7 h-7 rounded overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-black/45 hover-gate:text-black transition-colors duration-150"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-black/45 hover-gate:text-black transition-colors duration-150 active:scale-[0.97]"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-xl text-black/45">
            {open ? 'close' : 'menu'}
          </span>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-black/8 bg-white">
          <ul className="flex flex-col px-6 py-3 gap-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-black/45 hover-gate:text-black transition-colors duration-150 py-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
