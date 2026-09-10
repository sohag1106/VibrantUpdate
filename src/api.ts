import { Category, Product, Order } from './types';

// Client for the Express API backed by Neon (Postgres). Replaces the old
// direct-to-Firestore calls in firebase.ts — the database connection string
// stays server-side, the browser only ever talks to /api/*.

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface ApiErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleApiError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: ApiErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('API Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`${options?.method ?? 'GET'} ${path} failed: ${res.status} ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Categories ----------

export const fetchCategories = () => request<Category[]>('/api/categories');

export const upsertCategory = (category: Category) =>
  request<Category>(`/api/categories/${category.id}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });

export const deleteCategory = (id: string) =>
  request<void>(`/api/categories/${id}`, { method: 'DELETE' });

// ---------- Products ----------

export const fetchProducts = () => request<Product[]>('/api/products');

export const upsertProduct = (product: Product) =>
  request<Product>(`/api/products/${product.id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });

export const deleteProduct = (id: string) =>
  request<void>(`/api/products/${id}`, { method: 'DELETE' });

// ---------- Orders ----------

export const fetchOrders = () => request<Order[]>('/api/orders');

export const saveOrder = (order: Order) =>
  request<Order>(`/api/orders/${order.id}`, {
    method: 'PUT',
    body: JSON.stringify(order),
  });

export const deleteOrder = (id: string) =>
  request<void>(`/api/orders/${id}`, { method: 'DELETE' });

export const resetOrders = () => request<void>('/api/orders', { method: 'DELETE' });
