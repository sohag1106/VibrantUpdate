import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { sql } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '..', 'schema.sql');

async function migrate() {
  const sqlText = readFileSync(schemaPath, 'utf8');
  // Split on statement boundaries so each statement runs as its own request
  // (the Neon HTTP driver executes one request per query).
  const statements = sqlText
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Applying ${statements.length} statements from ${schemaPath}...`);
  for (const statement of statements) {
    await sql(statement);
  }
  console.log('Migration complete: categories, products, orders tables are ready.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
