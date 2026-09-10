// Shared data-access layer for the Vibrant POS API.
//
// Used by BOTH the Express dev server (server/index.js) and the Cloudflare
// Pages Function (functions/api/[[path]].ts) so the API behaves identically
// in local dev and production.
//
// Every query function takes a `sql` query function created from the Neon
// HTTP driver (`neon()` from @neondatabase/serverless). Unlike node-postgres
// `Pool.query()` which returns `{ rows }`, the `neon()` function returns the
// result rows DIRECTLY (an array of objects), so the callers never touch a
// `rows` property.

import { neon } from '@neondatabase/serverless';

// Create a reusable query function from a Neon connection string.
export function createDb(connectionString) {
  return neon(connectionString);
}

// ---------- Row <-> API object mappers ----------
// Postgres NUMERIC columns come back as strings from the driver; convert
// them to numbers so the frontend gets the same shapes it got from Firestore.

export const toCategory = (row) => ({
  id: row.id,
  name: row.name,
  icon: row.icon,
  ...(row.order_index !== null ? { orderIndex: row.order_index } : {}),
});

export const toProduct = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  image: row.image,
  isAvailable: row.is_available,
  modifiers: row.modifiers ?? [],
  ...(row.sku ? { sku: row.sku } : {}),
  ...(row.variants ? { variants: row.variants } : {}),
});

export const toOrder = (row) => ({
  id: row.id,
  orderNumber: row.order_number,
  ...(row.token_number ? { tokenNumber: row.token_number } : {}),
  ...(row.customer_name ? { customerName: row.customer_name } : {}),
  ...(row.customer_mobile ? { customerMobile: row.customer_mobile } : {}),
  ...(row.customer_location ? { customerLocation: row.customer_location } : {}),
  ...(row.table_number ? { tableNumber: row.table_number } : {}),
  ...(row.cashier_name ? { cashierName: row.cashier_name } : {}),
  ...(row.payment_method ? { paymentMethod: row.payment_method } : {}),
  items: row.items ?? [],
  orderType: row.order_type,
  subtotal: Number(row.subtotal),
  tax: Number(row.tax),
  discount: Number(row.discount),
  discountType: row.discount_type,
  discountValue: Number(row.discount_value),
  ...(row.packaging_charge !== null ? { packagingCharge: Number(row.packaging_charge) } : {}),
  total: Number(row.total),
  status: row.status,
  createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
});

// ---------- Categories ----------

export async function getCategories(sql) {
  const rows = await sql`SELECT * FROM categories`;
  return rows.map(toCategory);
}

export async function upsertCategory(sql, { id, name, icon, orderIndex }) {
  const rows = await sql(
    `INSERT INTO categories (id, name, icon, order_index)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET name = $2, icon = $3, order_index = $4
     RETURNING *`,
    [id, name, icon, orderIndex ?? null]
  );
  return toCategory(rows[0]);
}

export async function deleteCategory(sql, id) {
  await sql('DELETE FROM categories WHERE id = $1', [id]);
}

// ---------- Products ----------

export async function getProducts(sql) {
  const rows = await sql`SELECT * FROM products`;
  return rows.map(toProduct);
}

export async function upsertProduct(sql, product) {
  const {
    id,
    name,
    category,
    price,
    image,
    isAvailable,
    modifiers,
    sku,
    variants,
  } = product;
  const rows = await sql(
    `INSERT INTO products (id, name, category, price, image, is_available, modifiers, sku, variants)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET
       name = $2, category = $3, price = $4, image = $5,
       is_available = $6, modifiers = $7, sku = $8, variants = $9
     RETURNING *`,
    [
      id,
      name,
      category,
      price,
      image,
      isAvailable,
      JSON.stringify(modifiers ?? []),
      sku ?? null,
      variants ? JSON.stringify(variants) : null,
    ]
  );
  return toProduct(rows[0]);
}

export async function deleteProduct(sql, id) {
  await sql('DELETE FROM products WHERE id = $1', [id]);
}

// ---------- Orders ----------

export async function getOrders(sql) {
  const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return rows.map(toOrder);
}

export async function upsertOrder(sql, o) {
  const rows = await sql(
    `INSERT INTO orders (
       id, order_number, token_number, customer_name, customer_mobile, customer_location,
       table_number, cashier_name, payment_method, items, order_type, subtotal, tax,
       discount, discount_type, discount_value, packaging_charge, total, status, created_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
     ON CONFLICT (id) DO UPDATE SET
       order_number = $2, token_number = $3, customer_name = $4, customer_mobile = $5,
       customer_location = $6, table_number = $7, cashier_name = $8, payment_method = $9,
       items = $10, order_type = $11, subtotal = $12, tax = $13, discount = $14,
       discount_type = $15, discount_value = $16, packaging_charge = $17, total = $18,
       status = $19, created_at = $20
     RETURNING *`,
    [
      o.id,
      o.orderNumber,
      o.tokenNumber ?? null,
      o.customerName ?? null,
      o.customerMobile ?? null,
      o.customerLocation ?? null,
      o.tableNumber ?? null,
      o.cashierName ?? null,
      o.paymentMethod ?? null,
      JSON.stringify(o.items ?? []),
      o.orderType,
      o.subtotal,
      o.tax,
      o.discount,
      o.discountType,
      o.discountValue,
      o.packagingCharge ?? null,
      o.total,
      o.status,
      o.createdAt,
    ]
  );
  return toOrder(rows[0]);
}

export async function deleteOrder(sql, id) {
  await sql('DELETE FROM orders WHERE id = $1', [id]);
}

export async function resetOrders(sql) {
  await sql('DELETE FROM orders');
}
