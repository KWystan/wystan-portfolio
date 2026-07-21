# Wystan — Personal Portfolio

A personal portfolio site for **Karl Wystan Cabalonga** — aspiring web developer, IT student at West Visayas State University. Built with a React 19 + Vite 8 frontend and an Express.js 4 backend that doubles as an AI chat proxy.

## Features

- **Portfolio landing page** — Hero, About, Stack, Education, Projects, Certifications, CTA sections
- **AI Chat Widget** — floating chat bubble (landing page) powered by NVIDIA NIM (Llama 3.1 8B)
- **AI Chat Page** — standalone `/chat` page with model selection and SSE streaming via OpenCode Zen (MiMo-V2.5 and others)
- **Paper aesthetic** — SVG fractal-noise grain overlay, grid-line borders, Emil Kowalski design engineering conventions
- **Typewriter hero** — cycling title with blink cursor
- **Scroll-reveal animations** — intersection-observer-based fade-in on scroll

## Project Structure

```
.
├── client/              # React 19 + Vite 8 (ESM)
│   ├── src/
│   │   ├── components/  # Navbar, Hero, About, Stack, Education, Projects, Certifications, CTA, Footer, ChatWidget, Noise, LoadingScreen
│   │   ├── pages/       # ChatPage.jsx
│   │   ├── hooks/       # useScrollReveal, useTypewriter
│   │   ├── data/        # portfolioData.js (single source of truth for all content)
│   │   ├── assets/      # Images, certificates, project snippets
│   │   ├── App.jsx      # Root: hand-rolled routing, section composition
│   │   ├── index.css    # Tailwind v4 CSS-first config + design tokens
│   │   └── main.jsx     # Entry point
│   └── package.json
├── server/              # Express.js 4 API (CommonJS)
│   ├── index.js         # Routes: /api/chat, /api/chat-full, /api/health
│   ├── system-prompt.txt
│   └── package.json
├── DOCS.md              # Architectural documentation
├── CLAUDE.md            # Guidance for Claude Code
├── emil-design-eng-skill.md  # Design engineering reference
├── VERCEL-DEPLOY-GUIDE.md  # Standalone deployment guide
└── README.md
```

## Getting Started

```powershell
# Terminal 1 — start the API server
cd server
npm run dev

# Terminal 2 — start the frontend
cd client
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health
- **Chat page:** http://localhost:3000/chat

The Vite dev server proxies `/api/*` requests to the Express backend automatically.

## Commands

| Project | Command | Description |
|---------|---------|-------------|
| `client` | `npm run dev` | Vite dev server on port 3000 (HMR) |
| `client` | `npm run build` | Production build → `client/dist/` |
| `client` | `npm run preview` | Preview production build locally |
| `client` | `npm run lint` | ESLint (flat config) |
| `server` | `npm run dev` | Dev mode with `--watch` (auto-restart) on port 5000 |
| `server` | `npm start` | Production start |

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4, `styled-components`, `react-icons`, `react-github-calendar` |
| Backend | Node.js 22+, Express.js 4 |
| AI (Widget) | NVIDIA NIM — `meta/llama-4-maverick-17b-128e-instruct` |
| AI (Chat Page) | OpenCode Zen — `mimo-v2.5-free` (selectable models) |
| Language | JavaScript (ESM in client, CommonJS in server) |

## Environment

Copy `server/.env.example` or create `server/.env`:

```
NVIDIA_API_KEY=nvapi-...
OPENCODE_API_KEY=oc_...
PORT=5000
```

The server starts without keys — chat endpoints return 503 with a friendly message until configured.

## Vercel Deployment

Deploy as a single project — the Express server runs as a serverless function, the Vite SPA as static output.

1. Push the repo to GitHub
2. In Vercel dashboard → **Add New Project** → import the repo
3. **Framework Preset** → Other (the `vercel.json` handles the rest)
4. Click **Deploy**
5. After deploy, go to **Settings → Environment Variables** and add:
   - `NVIDIA_API_KEY` — for the portfolio chat widget
   - `OPENCODE_API_KEY` — for the streaming chat page
   - `OPENCODE_BASE_URL` — optional, defaults to `https://opencode.ai/zen/v1`
6. Redeploy or wait for auto-deploy

## Architecture Notes

- **No React Router** — hand-rolled `usePathname()` hook tracking `popstate`, switching between `/` and `/chat`
- **No TypeScript** — `@types/react` in devDeps for editor intellisense only
- **Single content source** — `client/src/data/portfolioData.js` drives all sections
- **Tailwind v4 CSS-first** — tokens in `@theme {}` inside `index.css`, no `tailwind.config.js`
- **Hover-gated** — hover-only effects use `hover-gate:` classes (gate: `@media (hover: hover) and (pointer: fine)`)
- **Tests** — none configured
- **SSE streaming** — `/api/chat-full` streams tokens via Server-Sent Events; both server and client implement matching `data:` line parsing
