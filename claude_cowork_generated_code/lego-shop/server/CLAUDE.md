# Server — Backend Context

Express.js REST API using ES modules (`"type": "module"` in package.json). Runs on **port 3001**.

## Key files

| File | Purpose |
|------|---------|
| `index.js` | Entry point — calls `initializeDatabase()` then `app.listen(3001)` |
| `app.js` | `createApp()` factory — all Express setup lives here, no `listen()` call |
| `db.js` | `DatabaseWrapper` over sql.js + exported `initializeDatabase()` |
| `logger.js` | Three Winston loggers: `technicalLogger`, `businessLogger`, `orderLogger(id)` |
| `data/seed.sql` | SQLite schema + all 50 seed products — executed on every startup |
| `middleware/requestLogger.js` | Logs every HTTP request via `technicalLogger` |

## Database pattern

The DB is always accessed via the default export from `db.js`, which is a Proxy that throws if used before `initializeDatabase()` is called:

```js
import db from '../db.js'

// Querying
const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
const products = db.prepare('SELECT * FROM products').all()

// Inserting — result has .lastInsertRowid and .changes
const result = db.prepare('INSERT INTO products (...) VALUES (...)').run(...)
const newId = result.lastInsertRowid
```

All column names are snake_case. Never use camelCase field names.

## Adding a new route

1. Create `routes/myroute.js` — use the existing route files as a template
2. Import and mount it in `app.js`:
   ```js
   import myRouter from './routes/myroute.js'
   app.use('/api/myroute', myRouter)
   ```
3. Always import and use the loggers:
   ```js
   import { technicalLogger, businessLogger } from '../logger.js'
   ```

## Logging conventions

- `technicalLogger` — server events, HTTP errors, startup, exceptions
- `businessLogger` — domain events (order created, status changed, payment processed)
- `orderLogger(orderId)` — per-order events; creates `logs/orders/{id}.log`

Always log errors in catch blocks:
```js
} catch (error) {
  technicalLogger.error('Description of what failed', { error: error.message })
  res.status(500).json({ error: 'User-facing message' })
}
```

## Payment route

`POST /api/payments/process` is a mock — it always returns success after a 500ms delay:

```json
{ "success": true, "payment_id": "PAY-abc123", "status": "completed" }
```

No real payment gateway is involved. The `payment_id` from this response is passed to `POST /api/orders` as `payment_id` in the request body.

## Order creation flow

1. Frontend calls `POST /api/payments/process` first
2. Gets back `payment_id`
3. Calls `POST /api/orders` with all order data including `payment_id`
4. Backend creates order (status: `pending`), order_items, and a payments record

Required fields for `POST /api/orders`:
```
customer_name, customer_email,
shipping_address_line1, shipping_city, shipping_zip, shipping_country,
invoice_address_line1, invoice_city, invoice_zip, invoice_country,
items: [{ product_id, quantity, unit_price }]
```

## Tests

Tests are in `tests/` and use **Vitest + Supertest**. They import `createApp()` directly from `app.js` so no server needs to be running:

```js
import { createApp } from '../app.js'
const app = createApp()
```

Each test file calls `initializeDatabase()` in `beforeEach` to get a fresh in-memory DB.

Run with: `npm test`
