# Deploying Vibrant POS

Vibrant POS is a React + Vite single-page app with an API and a Postgres
database. It's designed to run entirely on **Cloudflare Pages** (static site +
Functions) with **Neon** for Postgres, sourced from a **GitHub** repository.

## Architecture

```
GitHub repo
   │  (Cloudflare Pages auto-builds from the repo)
   ▼
Cloudflare Pages  ── serves the React app (npm run build → dist/)
   │  functions/api/[[path]].ts handles every /api/* request
   ▼
Neon Postgres  ── read via @neondatabase/serverless HTTP driver (neon())
```

- The frontend talks to `/api/*` with **relative** URLs, so it works on any
  host with no config.
- The API logic lives once in `functions/lib/handlers.js` and is shared by both
  the local Express dev server and the Cloudflare Pages Function — so local dev
  and production behave identically.
- The database is reached over plain HTTPS (SQL-over-HTTP) using Neon's
  serverless driver, which runs on both Node (local) and Cloudflare's workerd
  runtime (production).

## 1. One-time local setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create a local `.env` from the example and add your Neon connection string:

   ```bash
   cp .env.example .env
   # edit .env -> DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require"
   ```

3. Apply the database schema once (creates `categories`, `products`, `orders`):

   ```bash
   npm run db:migrate
   ```

4. Run locally:

   ```bash
   npm run dev        # Vite on :3000 + API on :8787
   ```

   The app seeds initial categories/products/orders into your Neon database on
   first load, so the dashboard is populated.

## 2. Deploy to Cloudflare Pages

### In Neon
- You already have a Neon project (the `DATABASE_URL` in your `.env`). You can
  use the main branch's connection string as-is. No changes needed.

### On GitHub
- Push this repo to your GitHub account (already configured in this repo's
  git `origin`).

### On Cloudflare
1. Go to **Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git**.
2. Choose the GitHub repo.
3. Set the **build configuration**:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add the environment variable (Settings → Environment variables):
   - `DATABASE_URL` = your Neon connection string.
5. Deploy. The `functions/api/[[path]].ts` Functions are bundled and deployed
   automatically — no extra action needed.

Your site will be live at `https://<project-name>.pages.dev`.

> **Note on environment variables:** `DATABASE_URL` is server-side only. It is
> read by the Pages Function from `context.env.DATABASE_URL` and by local
> tooling from `.env`. It is never sent to the browser (see `.gitignore` — the
> real `.env` is not committed).

## 3. Updating the site

Cloudflare Pages rebuilds and redeploys automatically on every push to the
connected GitHub branch. No manual steps.

## Development-only Express server

`server/index.js` is kept for local development (it powers `npm run dev`'s API
side). In production the `/api/*` routes run as a Cloudflare Pages Function
(`functions/api/[[path]].ts`) instead, so the Express server is not deployed.
