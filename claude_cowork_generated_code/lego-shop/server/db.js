import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Wrapper class that provides a better-sqlite3-compatible API over sql.js
class DatabaseWrapper {
  constructor(sqlDb) {
    this.sqlDb = sqlDb;
  }

  prepare(sql) {
    const db = this.sqlDb;
    return {
      get(...params) {
        const stmt = db.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const results = [];
        const stmt = db.prepare(sql);
        if (params.length > 0) stmt.bind(params);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      },
      run(...params) {
        db.run(sql, params);
        const changes = db.getRowsModified();

        // Get the last insert row id using a prepared statement
        const lastIdStmt = db.prepare('SELECT last_insert_rowid() as id');
        let lastInsertRowid = 0;
        if (lastIdStmt.step()) {
          const row = lastIdStmt.getAsObject();
          lastInsertRowid = row.id;
        }
        lastIdStmt.free();

        return {
          changes,
          lastInsertRowid
        };
      }
    };
  }

  exec(sql) {
    this.sqlDb.exec(sql);
  }

  pragma(pragmaStr) {
    this.sqlDb.exec(`PRAGMA ${pragmaStr}`);
  }
}

let db;

async function initializeDatabase() {
  const SQL = await initSqlJs();
  const sqlDb = new SQL.Database();
  db = new DatabaseWrapper(sqlDb);

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Initialize from seed.sql
  const seedPath = path.join(__dirname, 'data', 'seed.sql');
  const seedSQL = fs.readFileSync(seedPath, 'utf8');
  db.exec(seedSQL);

  return db;
}

export { initializeDatabase };
export default new Proxy({}, {
  get(target, prop) {
    if (!db) throw new Error('Database not initialized. Call initializeDatabase() first.');
    return db[prop].bind ? db[prop].bind(db) : db[prop];
  }
});
