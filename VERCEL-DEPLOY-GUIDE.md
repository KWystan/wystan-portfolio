# Vercel Monorepo Deployment Guide

> Deploy a client + server project on Vercel as a **single project** — the frontend
> (SPA) serves as static output, the backend runs as a serverless function, and
> they share one domain.

---

## Table of Contents

1. [How It Works](#1-how-it-works)
2. [Project Structure Requirements](#2-project-structure-requirements)
3. [Step 1 — Create the API Handler](#3-step-1--create-the-api-handler)
4. [Step 2 — Modify the Server](#4-step-2--modify-the-server)
5. [Step 3 — Create vercel.json](#5-step-3--create-verceljson)
6. [Step 4 — Optional: Include Non-JS Files](#6-step-4--optional-include-non-js-files)
7. [Step 5 — Deploy to Vercel](#7-step-5--deploy-to-vercel)
8. [Step 6 — Environment Variables](#8-step-6--environment-variables)
9. [Troubleshooting](#9-troubleshooting)
10. [Example: Wystan Portfolio](E:\Project\Portfolio)

---

## 1. How It Works

Vercel can serve both a static frontend and a serverless backend in one project
using a simple trick:

```
your-domain.com/
  ├── /api/*  →  Vercel runs api/index.js as a Node.js serverless function
  └── /*      →  Vercel serves static files (your built SPA)
```

- The Vite (or Next.js, etc.) build output becomes the static files.
- A tiny `api/index.js` file imports your Express/Fastify/Node app and exports
  it for Vercel's Node.js runtime.
- `vercel.json` ties it all together: build commands, routing rules, and
  function configuration.

---

## 2. Project Structure Requirements

Your project must have **three things** at the root level:

```
your-project/
├── api/
│   └── index.js        ← Vercel serverless entry point
├── client/              ← Your frontend (Vite, React, etc.)
│   ├── src/
│   ├── package.json
│   └── vite.config.js  ← development proxy to localhost:PORT
├── server/              ← Your backend (Express, Fastify, etc.)
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── vercel.json          ← Deployment config
└── .gitignore
```

> The names `client/` and `server/` are conventions — yours can be anything.
> Just update the paths in `vercel.json` to match.

---

## 3. Step 1 — Create the API Handler

Create `api/index.js` at the root of your project:

```js
// api/index.js — Vercel reads this file and runs it as a serverless function

const app = require('../server/index');  // ← point this at your Express/Node app
module.exports = app;
```

That's it. This file:
1. Imports your server app (which you export via `module.exports`)
2. Re-exports it so Vercel's Node.js runtime can handle incoming requests

Vercel automatically detects `api/` as serverless functions — no extra config
needed for that part.

---

## 4. Step 2 — Modify the Server

Your server (`server/index.js`) needs two small changes:

### 4a. Export the app

Add `module.exports = app` at the bottom of your server file.

### 4b. Guard the app.listen() call

Wrap `app.listen()` so it only runs when the file is executed directly (not
when imported by Vercel):

```js
// At the very bottom of server/index.js

module.exports = app;                  // ← always export

if (require.main === module) {         // ← only listen when run directly
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
```

**Why this works:**
- Locally, you run `node index.js` → `require.main === module` is `true` → the
  server starts and listens on your port.
- On Vercel, `api/index.js` does `require('../server/index')` →
  `require.main === module` is `false` → no listening. Vercel handles
  invocation itself.

### 4c. Optional: Explicit dotenv path

If your server uses `dotenv`, give it an explicit path so it always finds the
right `.env` file regardless of where Node runs:

```js
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
```

This doesn't affect Vercel (there's no `.env` file on deploy — env vars come
from the dashboard), but it makes local development more reliable.

---

## 5. Step 3 — Create vercel.json

Create `vercel.json` at the root of your project:

```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install --prefix client && npm install --prefix server",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/" }
  ],
  "functions": {
    "api/index.js": {
      "memory": 256,
      "maxDuration": 30
    }
  }
}
```

### What each field does

| Field | Your value | Purpose |
|---|---|---|
| `buildCommand` | `cd client && npm run build` | Builds the frontend into static files |
| `outputDirectory` | `client/dist` | Where the build output lands (Vite default) |
| `installCommand` | `npm install --prefix client && npm install --prefix server` | Installs deps for BOTH projects |
| `rewrites[0]` | `/api/(.*)` → `/api` | All `/api/*` requests go to the serverless function |
| `rewrites[1]` | `/(.*)` → `/` | Everything else serves the SPA `index.html` (enables client-side routing like `/chat`) |
| `functions.memory` | `256` | RAM in MB for the serverless function |
| `functions.maxDuration` | `30` | Timeout in seconds for API calls |

### Adjust for your project

- **Different frontend framework?** Change `buildCommand` and `outputDirectory`
  to match (e.g., Next.js → `next build` and `.next`).
- **Different folder names?** Update the paths (`cd my-app`, `my-app/dist`).
- **Your server uses CommonJS?** Keep as-is.
- **Your server is ESM?** Use `import` in `api/index.js` instead of `require`.

---

## 6. Step 4 — Optional: Include Non-JS Files

If your server reads files at boot (like a `system-prompt.txt`, a JSON config,
or a certificate), Vercel won't automatically bundle them. Tell it to include
them:

```json
{
  "functions": {
    "api/index.js": {
      "includeFiles": "server/system-prompt.txt"
    }
  }
}
```

You can use a glob to include multiple files:
```json
"includeFiles": "server/**"
```

---

## 7. Step 5 — Deploy to Vercel

### Option A: Via GitHub (recommended)

```bash
# 1. Push to GitHub
git init
git add -A
git commit -m "ready for deploy"
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main

# 2. Go to https://vercel.com → Add New → Project
# 3. Import your GitHub repo
# 4. Framework Preset → Other (vercel.json handles everything)
# 5. Root Directory → ./ (default)
# 6. Click Deploy
```

The Build Command, Output Directory, and Install Command fields will
auto-fill from your `vercel.json`.

### Option B: Via CLI

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

---

## 8. Step 6 — Environment Variables

After the first deploy:

1. Go to your Vercel project dashboard → **Settings → Environment Variables**
2. Add any variables your server needs (API keys, database URLs, etc.)
3. Set scope to **Production** (and **Preview** if desired)
4. Redeploy or wait for the auto-deploy

**Never commit `.env` files.** Use `.env.example` as a template instead.

---

## 9. Troubleshooting

### "Cannot find module '../server/index'"

- Make sure `server/index.js` exists and is a CommonJS file (uses `require`,
  not `import`).
- If your server is ESM, change `api/index.js` to use `import` instead.

### "ERR_MODULE_NOT_FOUND" or ESM import issues

Vercel's `api/` directory works best with CommonJS (`require`/`module.exports`).
If your server uses ESM:
- Create `api/index.mjs` instead of `api/index.js`.
- Use dynamic `import()` in `api/index.mjs` to load the server.

### "/chat" page shows 404 on first load

Make sure your `vercel.json` has the second rewrite rule:
```json
{ "source": "/(.*)", "destination": "/" }
```
Without it, Vercel tries to find a file matching `/chat` and returns 404.

### API returns 502/504 timeout

Increase the `maxDuration` in `vercel.json`:
```json
"functions": { "api/index.js": { "maxDuration": 60 } }
```
Vercel's maximum is 60 seconds on the free plan, 900 on paid plans.

### API returns 503 "not configured"

Your environment variables aren't set. Go to Vercel dashboard → Settings →
Environment Variables and add them, then redeploy.

### Local dev still works after changes?

Run `node server/index.js` or `npm run dev` locally — it should work exactly
as before. The `require.main === module` guard only changes behavior when the
file is imported as a module.

---

## 10. Example: Wystan Portfolio

This guide is based on the **Wystan Portfolio** project. Here's how it maps:

| Concept | Wystan's setup |
|---|---|
| Frontend | `/client` — React 19 + Vite 8 + Tailwind v4 |
| Backend | `/server` — Express.js 4 (CommonJS) |
| API handler | `api/index.js` → `require('../server/index')` |
| vercel.json build | `cd client && npm run build` |
| Output dir | `client/dist` |
| Install | `npm install --prefix client && npm install --prefix server` |
| Extra files | `server/system-prompt.txt` (included via `includeFiles`) |
| Dev proxy | Vite proxies `/api/*` → `localhost:5000` |
| Local dev | `npm run dev` (concurrently runs both) |

### Files from Wystan's deployment

**`api/index.js`:**
```js
const app = require('../server/index');
module.exports = app;
```

**`server/index.js` (bottom):**
```js
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
```

**`vercel.json`:**
```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/dist",
  "installCommand": "npm install --prefix client && npm install --prefix server",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" },
    { "source": "/(.*)", "destination": "/" }
  ],
  "functions": {
    "api/index.js": {
      "memory": 256,
      "maxDuration": 30,
      "includeFiles": "server/system-prompt.txt"
    }
  }
}
```
