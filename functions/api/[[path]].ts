// Cloudflare Pages Function: single catch-all handler for every /api/* route.
//
// Replaces the Node/Express backend in production. Runs on Cloudflare's
// workerd runtime and talks to Neon over HTTP via the shared `neon()` client
// (server/handlers.js) — the same driver the local Express dev server uses,
// so behavior is identical in dev and production.
//
// Route matrix (mirrors server/index.js):
//   GET    /api/:resource            -> list (categories | products | orders)
//   PUT    /api/:resource/:id        -> upsert
//   DELETE /api/:resource/:id        -> delete
//   DELETE /api/orders               -> reset all orders

import {
  createDb,
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
} from '../lib/handlers.js';

interface Env {
  DATABASE_URL: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: { path?: string[] };
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const noContent = () => new Response(null, { status: 204 });

export const onRequest = async (context: PagesContext) => {
  const { request, env } = context;
  const segments = (context.params.path ?? []) as string[];
  const resource = segments[0];
  const id = segments[1];
  const method = request.method;

  try {
    const sql = createDb(env.DATABASE_URL);

    if (resource === 'categories') {
      if (method === 'GET' && !id) return json(await getCategories(sql));
      if (method === 'PUT' && id) return json(await upsertCategory(sql, await request.json()));
      if (method === 'DELETE' && id) {
        await deleteCategory(sql, id);
        return noContent();
      }
    }

    if (resource === 'products') {
      if (method === 'GET' && !id) return json(await getProducts(sql));
      if (method === 'PUT' && id) return json(await upsertProduct(sql, await request.json()));
      if (method === 'DELETE' && id) {
        await deleteProduct(sql, id);
        return noContent();
      }
    }

    if (resource === 'orders') {
      if (method === 'GET' && !id) return json(await getOrders(sql));
      if (method === 'PUT' && id) return json(await upsertOrder(sql, await request.json()));
      if (method === 'DELETE' && !id) {
        await resetOrders(sql);
        return noContent();
      }
      if (method === 'DELETE' && id) {
        await deleteOrder(sql, id);
        return noContent();
      }
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('API error:', err);
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
};
