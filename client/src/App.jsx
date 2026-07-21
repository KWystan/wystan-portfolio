import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Noise from './components/Noise';
import LoadingScreen from './components/LoadingScreen';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Achievements from './pages/Achievements';
import Experience from './pages/Experience';
import Uses from './pages/Uses';
import Contact from './pages/Contact';
import Links from './pages/Links';
import NotFound from './pages/NotFound';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <BrowserRouter>
      {/* ── Noise grain background ────────────────────────────── */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
        <Noise patternAlpha={12} />
      </div>

      <div className="relative z-10">
        <Routes>
          {/* ── Pages with sidebar layout ──────────────────────── */}
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="experience" element={<Experience />} />
            <Route path="uses" element={<Uses />} />
            <Route path="contact" element={<Contact />} />
            <Route path="links" element={<Links />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ── Chat page (no sidebar) ─────────────────────────── */}
          <Route path="chat" element={<ChatPage />} />
        </Routes>

        {/* ── Chat widget (floats on all layout pages) ────────── */}
        <ChatWidget />
      </div>
    </BrowserRouter>
  );
}
