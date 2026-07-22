# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```powershell
# Root — runs both concurrently (two terminals in one)
npm run dev                   # Starts client (:3000) + server (:5000) side by side
npm run build                 # Production build → client/dist/
npm run lint                  # ESLint on client only
npm run preview               # Preview the production build locally

# Or run individually (two separate terminals)
npm run dev:client            # Vite dev server on :3000 with HMR
npm run dev:server            # Express with --watch (auto-restart) on :5000

# Client-only
cd client && npm run dev       # Dev server on :3000 with HMR
cd client && npm run build     # Production build → client/dist/
cd client && npm run preview   # Preview the production build locally
cd client && npm run lint      # ESLint (flat config)

# Server-only
cd server && npm run dev       # Dev mode with --watch (auto-restart) on :5000
cd server && npm start         # Production start
```

The Vite dev server proxies `/api/*` to the Express server, so only `http://localhost:3000` needs to be open in the browser. The `npm run dev` command at root runs both projects concurrently via `concurrently -n client,server -c cyan,green` — output is prefixed with `[client]` / `[server]` in color-coded tags.

### Dependencies at a glance

| Layer | Module system | Key deps |
|---|---|---|
| Root (`package.json`) | — | `concurrently` only |
| `client/` | ESM (`"type": "module"`) | React 19, Vite 8, Tailwind v4 (`@tailwindcss/vite`), `react-icons`, `styled-components`, `react-github-calendar` |
| `server/` | CommonJS (no `type`) | Express 4, `cors`, `dotenv` |
| `client/index.html` (Google Fonts) | external | **Material Symbols** (`material-symbols-outlined` class — used in every component), Geist, Geist Mono, Source Serif 4 |

## What this is

"Wystan" — a personal portfolio site for Karl Wystan Cabalonga. A plain two-directory monorepo (no workspace manager): `client/` is the React frontend, `server/` is the Express API that also proxies two AI chat providers.

## Architecture

- **`client/`** — React 19 + Vite 8 (ESM, `"type": "module"`). Styling is Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first config — there is no `tailwind.config.js`; tokens live in `@theme { }` inside `index.css`). Also pulls `styled-components` and `react-icons`. CommonJS third-party deps are fine to `import` here — Vite handles interop.

- **`server/`** — Express.js 4 (CommonJS — `require`/`module.exports`, no `"type": "module"`). Serves API under `/api/*` on port 5000 (configurable via `PORT`). Uses `cors` middleware and `dotenv`. HTTP requests to the two AI providers use the global `fetch` (Node 22) — no HTTP client dependency.

## Frontend architecture

- **Routing — no React Router.** `App.jsx` defines a hand-rolled `usePathname()` hook that tracks `window.location.pathname` via `popstate`. `/` renders the landing page; `/chat` renders `pages/ChatPage.jsx`. To navigate, code pushes with `window.history.pushState` (the popstate listener picks it up). Add new top-level routes by extending this switch — do not introduce React Router without checking first.

- **Landing-page composition** (`App.jsx`): a `LoadingScreen` gate runs first (calls `onFinish` to drop `loading` state), then `Navbar` → `main` {`Hero`, `About`, `Stack`, `Education`, `Projects`, `Certifications`, `Contributions`, `CTA`} → `Footer` → floating `ChatWidget`. A fixed full-screen `<Noise>` grain overlay (`z-0`, `pointer-events-none`) sits behind the `z-10` content.

- **Single source of content truth: `client/src/data/portfolioData.js`.** All copy — hero, about, stack, projects, certifications, education, nav links — and the image imports that back them live here. Sections consume it via named exports. **Edit content here, not inside the section components.** Project/certificate images live under `client/src/assets/` and are imported (Vite handles them), not referenced by URL.

- **Custom hooks (`client/src/hooks/`):**
  - `useScrollReveal.js` — `IntersectionObserver` reveal-on-scroll. Returns `[ref, visible]`; unobserves after the first intersection (fire-once). Accepts optional `{ threshold, rootMargin }` config. Pair with the `.scroll-reveal` / `.scroll-reveal.revealed` classes in `index.css`.
  - `useTypewriter.js` — hero typewriter. Ref-driven loop (word/char index in refs), so the only state update is `displayedText` — no re-render storm. Configurable `words`, `typingSpeed`, `deletingSpeed`, `pauseAfterType`, `pauseBeforeNext`.

- **Two chat surfaces, two endpoints:**
  - `components/ChatWidget.jsx` — the floating bubble on the landing page. POSTs to `/api/chat` and awaits a full JSON reply (`data.reply`); non-streaming.
  - `pages/ChatPage.jsx` — the standalone `/chat` page. POSTs to `/api/chat-full` and **streams** the response by reading `res.body.getReader()` + `TextDecoder`, parsing `data:` SSE lines, and appending tokens into the last assistant message. Holds an `AbortController` ref so in-flight requests can be cancelled. Renders inline code (\`…\`) and code blocks (\`\`\`…) via `renderMessageText()`.

- **GitHub Activity section** (`components/Contributions.jsx`): renders between `Certifications` and `CTA` on the landing page. Uses `react-github-calendar` to display a contribution heatmap for the `KWystan` GitHub account. Grey-on-white monochrome theme matching the paper aesthetic. Includes tooltip showing per-day counts.

- **Unused components:** `components/Experience.jsx` exists and has data in `portfolioData.js` (`experience` export) but is not rendered in `App.jsx`. It's a timeline-style card component ready to wire in when needed.

## Backend architecture (`server/index.js`)

All routes currently live in `index.js` (there is no `server/routes/` dir yet). The server reads `server/system-prompt.txt` **once at boot** with `fs.readFileSync` and uses it as the system message for the portfolio assistant. Middleware: `cors()` and `express.json({ limit: '64kb' })`. Environment variables are loaded from `server/.env` via `dotenv`.

Three endpoints:

| Endpoint | Upstream | Model | Stream? | Context | Used by |
|---|---|---|---|---|---|
| `POST /api/chat` | NVIDIA NIM (`https://integrate.api.nvidia.com/v1`) — base URL **hardcoded** | `meta/llama-3.1-8b-instruct` | No (`max_tokens` 512) | last 12 msgs + `system-prompt.txt` | `ChatWidget` |
| `POST /api/chat-full` | OpenCode Zen (base from `OPENCODE_BASE_URL`, default `https://opencode.ai/zen/v1`) | `mimo-v2.5-free` (client may override via `model` field) | Yes — SSE | last 20 msgs + inline system prompt | `ChatPage` |
| `GET /api/health` | — | — | — | — | health check: `{ status: 'OK' }` |

**Graceful degradation:** if `NVIDIA_API_KEY` is unset or still the placeholder `nvapi-YOUR_API_KEY_HERE`, `/api/chat` returns 503 with a "not configured" message rather than crashing. `/api/chat-full` does the same when `OPENCODE_API_KEY` is missing. Keep this pattern when adding AI routes.

**SSE streaming pattern (server):** the upstream response is consumed with `apiRes.body.getReader()` + `TextDecoder` into a line buffer; each `data:` line is parsed, the `choices[0].delta.content` is re-emitted as `data: {"content": ...}\n\n`, and `data: [DONE]\n\n` terminates the stream. The client (`ChatPage`) mirrors this same parse loop on `res.body`. If you change the wire format, update **both** sides.

**Env (`server/.env`, gitignored):** `NVIDIA_API_KEY`, `OPENCODE_API_KEY`, optional `OPENCODE_BASE_URL`, `PORT` (default 5000). The server will start without keys — the 503s handle it — but the chat features won't work until keys are set.

## Vercel deployment

The project deploys as a single Vercel project — the Express server runs as a serverless function, the Vite SPA as static output. Both share one domain.

### Files that make it work

| File | Role |
|---|---|
| `vercel.json` | Build command (`cd client && npm run build`), output dir (`client/dist`), install deps for both, rewrites |
| `api/index.js` | Imports `server/index.js` and exports the Express app for Vercel's Node.js runtime |
| `server/index.js` | Exports `app` via `module.exports` — `app.listen()` only runs when executed directly (`require.main === module`) |

### How traffic is routed

- **`/api/*`** → Express serverless function (`api/index.js`)
- **everything else** → the Vite SPA (`client/dist/`), so `/chat` serves `index.html` and React handles the route

### Environment variables

Set these in Vercel dashboard (Settings → Environment Variables) — **not** in a `.env` file:

| Variable | Notes |
|---|---|
| `NVIDIA_API_KEY` | Required for the portfolio chat widget |
| `OPENCODE_API_KEY` | Required for the full streaming chat |
| `OPENCODE_BASE_URL` | Optional, defaults to `https://opencode.ai/zen/v1` |

The server boots fine without them — chat endpoints return 503 gracefully.

### Deploy steps

```bash
# 1. Push to GitHub
git add .
git commit -m "ready for deploy"
git push

# 2. In Vercel dashboard:
#    - Import the repo (select your portfolio repo)
#    - Framework Preset → Other
#    - Root Directory → leave as ./
#    - Build Command → auto-picked from vercel.json
#    - Output Directory → auto-picked: client/dist
#    - Click Deploy

# 3. After deploy, add env vars in Settings → Environment Variables
# 4. Redeploy or wait for the auto-deploy to pick them up
```

## Styling & motion (Emil Kowalski design engineering)

Full reference: `emil-design-eng-skill.md` (root) and `DOCS.md`. The live tokens/keyframes are in `client/src/index.css`. Load-bearing conventions:

- **Tailwind v4 CSS-first config.** `@import "tailwindcss";` then `@theme { … }` defines design tokens: easing cubs (`--ease-out-expo`, `--ease-in-out-expo`, `--ease-spring`), `--animate-*` shorthand, fonts (`--font-sans` = Geist, `--font-serif` = Source Serif 4, `--font-mono` = Geist Mono, `--font-display` = Geist Pixel). Add tokens here, not in a JS config.
- **Only animate `transform` and `opacity`** — never `width`/`height`/`margin`/`padding` (layout/paint).
- **Never animate from `scale(0)`** — entries use `scale(0.95)` + `opacity: 0` (see the `scale-in` / `fade-up` keyframes).
- **Custom cubic-bezier easing only** — no CSS built-in easings. Use the `--ease-*` vars.
- **Durations under 300ms** for UI; buttons `active:scale-[0.97]` (floating buttons `0.92`); stagger list/grid items 30–80ms.
- **Hover is gated.** Tailwind can't emit `@media (hover: hover) and (pointer: fine)` inline, so `index.css` hand-authors `hover-gate:*` classes (e.g. `hover-gate:border-black/25`, `hover-gate:text-black`). Use `hover-gate:` — not bare `hover:` — for hover-only effects so touch devices degrade gracefully.
- **Paper aesthetic.** Light theme: white bg / black text. Two layers of SVG fractal-noise grain on `body::before`/`::after` (`mix-blend-mode: multiply`), plus a `<Noise>` component overlay. Vertical/horizontal "grid-line" borders `border-drift` subtly.
- **Icon system: Google Material Symbols.** Loaded from Google Fonts in `client/index.html` as a CSS font, not from npm. Used via `<span class="material-symbols-outlined">icon_name</span>` across every component. See the [Material Symbols catalog](https://fonts.google.com/icons) for icon names.
- **`prefers-reduced-motion`** collapses all animation/transition durations to ~0ms but keeps opacity/color transitions.

## Key cross-cutting patterns

- **API proxy bridge:** `client/vite.config.js` proxies `/api` → `http://localhost:5000` (with `changeOrigin`). Frontend code fetches via relative paths (`fetch('/api/health')`) — never hardcode `http://localhost:5000`. In production a reverse proxy replaces this; no env-aware URL switching exists in the app.
- **ESM vs CJS:** client ESM, server CommonJS — match the module system of the project you're editing; don't mix.
- **No TypeScript** in either project. The client keeps `@types/react` + `@types/react-dom` in devDeps for editor intellisense only.
- **Tests:** none configured. There is no test runner, linters cover linting only (`eslint .` in `client`; the server has no lint script).

## Adding things

- **New API route:** add a handler in `server/index.js` (or split into `server/routes/` and `require()` it) with an `/api` prefix. The Vite proxy forwards it automatically — no client config change. Call from the client with a relative `/api/...` path.
- **New landing section:** create `client/src/components/Name.jsx`, place it in the `main` block in `App.jsx`, and source its content from `portfolioData.js`.
- **New top-level page (new route):** create it under `client/src/pages/`, add a `pathname` branch to the `usePathname()` switch in `App.jsx`, and navigate via `window.history.pushState` (no React Router).

## Local permission constraints

`.claude/settings.local.json` denies `git reset --hard`, `git push --force`, and `rm -rf` for this session/this repo. Use scoped deletes and non-destructive git instead — the harness will refuse those three.

## Session start — file maintenance

At the start of every session, read these three files and update them to reflect any changes made since they were last written:

- **`.gitignore`** — add any new generated files, build artifacts, or dependency directories to exclude from version control.
- **`README.md`** — keep the project overview accurate: new features, changed commands, added stack items.
- **`DOCS.md`** — keep the architectural documentation current: new patterns, changed conventions, added routes, new tools or configuration.
