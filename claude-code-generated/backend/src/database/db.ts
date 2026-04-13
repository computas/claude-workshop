import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(':memory:');
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
    db.exec(schema);

    const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
    db.exec(seed);
  }
  return db;
}
