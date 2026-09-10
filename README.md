# Vibrant POS

A full-stack restaurant **Point-of-Sale (POS) & Kitchen Management** app — cashier register, live customer screen, admin control, and thermal receipt printing, all synced to a cloud database.

---

## ✨ Features

- **Cashier Register (POS)** — build carts, apply discounts / coupons / tax, split payments, order across the network.
- **Customer Screen** — live dual-display order feed for customers to watch.
- **Admin Control** — manage categories, products, orders; export sales reports.
- **Cloud-Synced** — data lives in Neon (Postgres), served through a serverless API.

## 🧱 Tech Stack

- **Frontend:** React 19 · Vite 6 · TypeScript · Tailwind CSS 4
- **Backend:** Cloudflare Pages Functions (workerd runtime) · Express (local dev)
- **Database:** Neon Postgres via `@neondatabase/serverless` HTTP driver
- **Hosting:** Cloudflare Pages → `https://vibrant-pos.pages.dev`

## 🔐 Login

Credentials are verified **server-side** (`POST /api/login`) against environment variables — never in the browser. Ask your administrator for access.

## 🚀 Local Development

```bash
npm install
npm run dev        # Vite on :3000 + Express API on :8787
npm run db:migrate # (optional) create/migrate the Neon tables
```

## 🌐 Deployment

See [DEPLOY.md](DEPLOY.md) for the full Cloudflare Pages + Neon setup.

---

## 🏷️ Trademark

**Vibrant POS** is developed and maintained by:

**Brightsky IT** — [www.brightskyit.com](https://www.brightskyit.com)

All product names, logos, and brands are the property of Brightsky IT. © Brightsky IT. All rights reserved.
