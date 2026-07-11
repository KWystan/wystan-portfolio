# Documentation

> Claude Code: When starting a new session, read this file and update it to
> reflect any architectural changes, new patterns, or evolving decisions made
> during development.

## Architecture Overview

This project is a plain two-directory monorepo — no workspace manager, no monorepo tooling. Each folder is an independent Node.js project with its own `package.json` and dependencies. The frontend and backend communicate through an API proxy in development, and through a reverse proxy in production.

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                    │
│    └─ http://localhost:3000                                 │
│       └─ Vite Dev Server (client/)                          │
│          ├─ Serves React app (HMR)                          │
│          │  ├─ Landing page  (/)   ← portfolio sections     │
│          │  └─ Chat page     (/chat) ← standalone AI chat   │
│          └─ Proxies /api/* to :5000                         │
│                                                              │
└─────────────────────────────┬───────────────────────────────┘
                              │ /api/*
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Express.js (server/)                                       │
│    └─ http://localhost:5000                                 │
│       ├─ POST /api/chat       → NVIDIA NIM (Llama 4)   ◄── ChatWidget
│       ├─ POST /api/chat-full  → OpenCode Zen (MiMo)    ◄── ChatPage
│       │                        (SSE streaming)
│       └─ GET  /api/health     → { status: 'OK' }
└─────────────────────────────────────────────────────────────┘
```

## Module System

The two projects intentionally use different module systems:

- **Client (`client/`)** — ES Modules (`"type": "module"` in `package.json`). Uses `import`/`export` syntax. Required by Vite and modern React tooling. CommonJS third-party deps are fine — Vite handles interop.

- **Server (`server/`)** — CommonJS (no `"type": "module"`). Uses `require()`/`module.exports`. Express.js ecosystem and many Node.js packages remain CommonJS-first.

## Routing — No React Router

The app uses hand-rolled routing via a `usePathname()` hook defined in `App.jsx`:

```js
function usePathname() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onNavigate = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onNavigate);
    return () => window.removeEventListener('popstate', onNavigate);
  }, []);
  return path;
}
```

Routes:
| Path | Component |
|------|-----------|
| `/` | Landing page — `LoadingScreen` → `Navbar` + sections + `ChatWidget` |
| `/chat` | `ChatPage` — standalone AI chat interface |

Navigation uses `window.history.pushState` (the `popstate` listener picks it up).

## Frontend Component Architecture

### Composition in App.jsx

```
<LoadingScreen onFinish={…} />     ← gate (2.5s then fade out)
└─ [when done:] <AppContent>
   ├─ <Noise />                    ← fixed z-0, full-screen canvas grain
   ├─ <Navbar />
   ├─ <main>
   │  ├─ <Hero />                  ← typewriter, avatar, socials, CTA
   │  ├─ <About />                 ← bullet-point intro paragraphs
   │  ├─ <Stack />                 ← categorized tech tags + detail modals
   │  ├─ <Education />             ← education cards (university + HS)
   │  ├─ <Projects />              ← grid cards + image-snippet modals
   │  ├─ <Certifications />        ← card list + certificate-image modals
   │  └─ <CTA />                   ← email call-to-action
   ├─ <Footer />
   └─ <ChatWidget />               ← floating chat bubble (bottom-right)
```

### Single Source of Content Truth

All copy lives in `client/src/data/portfolioData.js`:

| Export | Contains |
|--------|----------|
| `navLinks` | Section IDs for navbar |
| `hero` | Name, title, location, social links |
| `about` | Array of paragraph strings |
| `stack` | Categorized technology lists |
| `stackDetails` | Structured detail content (text/bullet/heading) for tech items |
| `experience` | Work/academic experience entries |
| `education` | School entries with images |
| `projects` | Project entries with techs, snippets, links |
| `certifications` | Certification entries with images and Credly links |
| `cta` | Call-to-action headline, availability, email |
| `footer` | Initials for footer display |

Images are imported from `client/src/assets/` so Vite can hash and bundle them. **Edit content in this file, not inside section components.**

### Custom Hooks

- **`useScrollReveal.js`** — `IntersectionObserver`-based reveal-on-scroll. Returns `[ref, visible]`. Unobserves after first intersection (fire-once). Use with `.scroll-reveal` / `.scroll-reveal.revealed` CSS classes.

- **`useTypewriter.js`** — Hero typewriter effect. Ref-driven loop (word/char index stored in refs to avoid re-render storms). Only state update is `displayedText`. Configurable words array, typing/deleting speeds, and pause durations.

### Dead Components

- **`Experience.jsx`** — Fully implemented section component with timeline layout, imported and ready to use but **not rendered** in App.jsx. Has corresponding data in `portfolioData.js`. To activate: import and place it in the `<main>` block of App.jsx.

## Two Chat Surfaces

| Feature | ChatWidget | ChatPage |
|---------|-----------|----------|
| Location | Landing page, bottom-right floating bubble | Standalone `/chat` route |
| Endpoint | `POST /api/chat` | `POST /api/chat-full` |
| Upstream | NVIDIA NIM (Llama 4 Maverick) | OpenCode Zen (MiMo-V2.5, Nemotron 3 Ultra, North Mini Code) |
| Streaming | No — full JSON reply | Yes — SSE streaming |
| Context | Last 12 messages | Last 20 messages |
| Input limit | 1000 chars | 4000 chars |
| Features | Auto-greeting on open | Model selector, message editing, copy button, sidebar, keyboard shortcuts |

### SSE Streaming Protocol

Both server and client implement matching `data:` line parsing:

```
Server sends:    data: {"content":"Hello"}\n\n
Stream ends:     data: [DONE]\n\n
Client parses:   read res.body.getReader() → TextDecoder → split('\n') → parse JSON from 'data:' lines
```

The upstream response is consumed with `apiRes.body.getReader()` + `TextDecoder` into a line buffer; each `data:` line is re-serialized through the same format.

## Styling & Motion Conventions (Emil Kowalski Design Engineering)

Full reference: `emil-design-eng-skill.md` (root).

### Tailwind v4 CSS-first Config

- `@import "tailwindcss"` then `@theme { … }` in `client/src/index.css`
- No `tailwind.config.js` — tokens live in the `@theme` block
- Design tokens defined: easing curves (`--ease-out-expo`, `--ease-in-out-expo`, `--ease-spring`), animation shorthands (`--animate-fade-up`, `--animate-scale-in`, `--animate-float`, `--animate-blink`), fonts (`--font-magazine` = Playfair Display, `--font-cursive` = Dancing Script)

### Motion Rules

- **Only animate `transform` and `opacity`** — never layout properties (width/height/margin/padding)
- **Never animate from `scale(0)`** — entries use `scale(0.95)` + `opacity: 0` (see `scale-in` / `fade-up` keyframes)
- **Custom cubic-bezier easing only** — no CSS built-in easings; use `--ease-*` vars
- **Durations under 300ms** for UI interactions; stagger list/grid items 30–80ms
- **Buttons `active:scale-[0.97]`** (floating buttons `0.92`)

### Hover Gating

Tailwind can't emit `@media (hover: hover) and (pointer: fine)` inline, so `index.css` hand-authors `hover-gate:*` utility classes. Use `hover-gate:` — not bare `hover:` — for hover-only effects so touch devices degrade gracefully.

Defined hover-gate classes:
- `hover-gate:border-black/{20,25,35,50}`
- `hover-gate:text-black`, `hover-gate:text-black/{80,90}`

### Paper Aesthetic

- White background (#ffffff), black (#000000) text
- Two layers of SVG fractal-noise grain on `body::before`/`::after` (`mix-blend-mode: multiply`, differing opacities)
- `<Noise>` component — Canvas-based grain overlay (animated noise pattern, refresh every 2 frames)
- Grid-line borders: vertical (`border-l`) and horizontal (`border-t`) with `border-line-animate` / `border-drift` keyframes for subtle opacity oscillation
- `prefers-reduced-motion` collapses all animation/transition durations to ~0ms but keeps opacity/color transitions

## API Proxy Pattern

```js
// client/vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

Frontend fetches relative: `fetch('/api/health')` — never hardcode `http://localhost:5000`. In production, a reverse proxy (nginx, Cloudflare, etc.) handles this instead.

## Server Architecture

### Endpoints

| Endpoint | Method | Upstream | Model | Streaming | Context | Used By |
|---|---|---|---|---|---|---|
| `/api/chat` | POST | NVIDIA NIM (hardcoded `https://integrate.api.nvidia.com/v1`) | `meta/llama-4-maverick-17b-128e-instruct` | No (`max_tokens: 512`) | Last 12 msgs + `system-prompt.txt` | ChatWidget |
| `/api/chat-full` | POST | OpenCode Zen (`OPENCODE_BASE_URL`, default `https://opencode.ai/zen/v1`) | Client-selectable (default `mimo-v2.5-free`) | Yes (SSE) | Last 20 msgs + inline system prompt | ChatPage |
| `/api/health` | GET | — | — | — | — | Health check |

### Graceful Degradation

If `NVIDIA_API_KEY` is unset or the placeholder `nvapi-YOUR_API_KEY_HERE`, `/api/chat` returns 503. If `OPENCODE_API_KEY` is missing, `/api/chat-full` returns 503. No server crash — the endpoints simply report "not configured."

### System Prompt

Loaded once at boot via `fs.readFileSync(path.join(__dirname, 'system-prompt.txt'), 'utf8')`. Contains Karl's professional profile, tech stack, projects, certifications, and behavioral guidelines. The `/api/chat-full` endpoint uses a separate inline system prompt (`CHAT_SYSTEM_PROMPT`) for general-purpose AI conversation (not portfolio-specific).

### Environment Variables (`server/.env`)

```
NVIDIA_API_KEY=nvapi-...
OPENCODE_API_KEY=oc_...
OPENCODE_BASE_URL=https://opencode.ai/zen/v1     # optional override
PORT=5000                                          # optional, default 5000
```

## Key Cross-Cutting Patterns

- **ESM vs CJS**: match the module system of the project you're editing
- **No TypeScript**: `@types/react` + `@types/react-dom` in devDeps for editor intellisense only
- **Tests**: none configured — linters cover linting only
- **API calls**: relative URLs (`/api/...`), no hardcoded origins in frontend code
- **Styling**: Tailwind utility classes + styled-components (LoadingScreen only) + CSS keyframes/animation classes in `index.css`

## Adding Things

### New API Route

1. Add handler in `server/index.js` (or create `server/routes/` and `require()` it) with `/api` prefix
2. The Vite proxy forwards automatically — no client config change
3. Call from client with `fetch('/api/...')`

### New Landing Section

1. Create `client/src/components/Name.jsx`
2. Source content from `portfolioData.js` (add a new named export)
3. Import and place in the `<main>` block in `App.jsx`

### New Top-Level Page

1. Create page under `client/src/pages/`
2. Add `pathname` branch to `usePathname()` switch in `App.jsx`
3. Navigate via `window.history.pushState`

### New Chat Model

1. Add to `MODELS` array in `ChatPage.jsx`
2. The model ID is sent in the request body — no server change needed (server passes it through)

## Known Issues / Unresolved

- **`client/src/assets/Facebook_files/`** — contains ~44MB of `.js.download` files from a browser page save; not part of the project. Should be deleted.
- **`Experience.jsx`** — implemented but unused; ready to slot into App.jsx
- **No loading/skeleton states** for the ChatWidget or ChatPage beyond the initial spinner animation
- **No error boundary** wrapping the React tree
