import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { sql } from './db.js';
import {
  getCategories,
  upsertCategory,
  deleteCategory,
  getProducts,
  upsertProduct,
  deleteProduct,
  getOrders,
  upsertOrder,
  deleteOrder,
  resetOrders,
} from '../functions/lib/handlers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8787;

app.use(express.json());

// Express 4 doesn't forward rejected promises from async handlers to error
// middleware on its own, so every route handler below is wrapped with this.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ---------- Categories ----------

app.get('/api/categories', asyncHandler(async (_req, res) => {
  res.json(await getCategories(sql));
}));

app.put('/api/categories/:id', asyncHandler(async (req, res) => {
  res.json(await upsertCategory(sql, req.body));
}));

app.delete('/api/categories/:id', asyncHandler(async (req, res) => {
  await deleteCategory(sql, req.params.id);
  res.status(204).end();
}));

// ---------- Products ----------

app.get('/api/products', asyncHandler(async (_req, res) => {
  res.json(await getProducts(sql));
}));

app.put('/api/products/:id', asyncHandler(async (req, res) => {
  res.json(await upsertProduct(sql, req.body));
}));

app.delete('/api/products/:id', asyncHandler(async (req, res) => {
  await deleteProduct(sql, req.params.id);
  res.status(204).end();
}));

// ---------- Orders ----------

app.get('/api/orders', asyncHandler(async (_req, res) => {
  res.json(await getOrders(sql));
}));

app.put('/api/orders/:id', asyncHandler(async (req, res) => {
  res.json(await upsertOrder(sql, req.body));
}));

app.delete('/api/orders/:id', asyncHandler(async (req, res) => {
  await deleteOrder(sql, req.params.id);
  res.status(204).end();
}));

app.delete('/api/orders', asyncHandler(async (_req, res) => {
  await resetOrders(sql);
  res.status(204).end();
}));

// ---------- Error handling ----------

app.use((err, _req, res, _next) => {
  console.error('API error:', err);
  res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
});

// ---------- Production static serving ----------
// In dev, Vite serves the frontend and proxies /api here.
// In production, Cloudflare Pages serves the built dist/ and the /api/*
// routes run as Pages Functions (functions/api/[[path]].ts), so this branch
// is only reached when running this server directly with NODE_ENV=production.

if (process.env.NODE_ENV === 'production') {
  const distDir = path.resolve(__dirname, '..', 'dist');
  app.use(express.static(distDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Vibrant POS API listening on http://localhost:${PORT}`);
});
