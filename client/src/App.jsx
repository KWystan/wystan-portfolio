import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Stack from './components/Stack';
import Education from './components/Education';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import LoadingScreen from './components/LoadingScreen';
import Noise from './components/Noise';
import ChatPage from './pages/ChatPage';

function usePathname() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onNavigate = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onNavigate);
    return () => window.removeEventListener('popstate', onNavigate);
  }, []);

  return path;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} />;
  }

  /* ── Chat page route ──────────────────────────────────────── */
  if (pathname === '/chat') {
    return <ChatPage />;
  }

  return (
    <>
      {/* ── Noise grain background ────────────────────────────── */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <Noise patternAlpha={12} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Stack />
          <Education />
          <Projects />
          <Certifications />
          <CTA />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </>
  );
}
