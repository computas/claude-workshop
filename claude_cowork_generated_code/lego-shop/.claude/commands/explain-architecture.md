Give a thorough explanation of how this application is structured, covering:

1. **The overall request flow** — from a user clicking "Add to Cart" all the way through checkout, payment, and order creation. Trace the exact sequence of function calls, API requests, and database writes.

2. **The database layer** — explain how `db.js` works, why sql.js was chosen over better-sqlite3, what the DatabaseWrapper class does, and how routes use the `db.prepare().get/all/run()` pattern.

3. **The logging system** — explain the three loggers (technical, business, per-order), when each is used, and where log files end up on disk.

4. **State management on the frontend** — explain CartContext and LanguageContext, how they are composed in main.jsx, and how a component accesses them.

5. **The Vite proxy** — explain why API calls use `/api/...` with no host, and how vite.config.js routes them to the backend.

Be concrete. Reference actual file names and line numbers where helpful.
