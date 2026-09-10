import 'dotenv/config';
import { createDb } from '../functions/lib/handlers.js';

if (!process.env.DATABASE_URL) {
  console.error(
    'DATABASE_URL is not set. Add it to a .env file (see .env.example) with your Neon connection string.'
  );
}

// The Neon HTTP client (SQL-over-fetch). It works on Node (local dev) AND on
// Cloudflare's workerd runtime (Pages Functions in production), so `npm run dev`
// and the deployed /api/* use the same driver.
export const sql = createDb(process.env.DATABASE_URL);
