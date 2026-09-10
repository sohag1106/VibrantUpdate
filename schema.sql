-- Vibrant POS schema for Neon (Postgres)
-- Run once via `npm run db:migrate`. Mirrors the entities previously
-- described in firebase-blueprint.json.

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  modifiers JSONB NOT NULL DEFAULT '[]',
  sku TEXT,
  variants JSONB
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  token_number TEXT,
  customer_name TEXT,
  customer_mobile TEXT,
  customer_location TEXT,
  table_number TEXT,
  cashier_name TEXT,
  payment_method TEXT,
  items JSONB NOT NULL,
  order_type TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  discount NUMERIC NOT NULL,
  discount_type TEXT NOT NULL,
  discount_value NUMERIC NOT NULL,
  packaging_charge NUMERIC,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
