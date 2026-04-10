# LEGO Shop — Claude Code Project Context

This is a **course example application** for a workshop on AI agents. It is a full-stack LEGO shopping website, intentionally simplified for teaching purposes.

## How to run

```bash
# Install all dependencies (first time only)
npm run install:all

# Start both servers together
npm run dev
```

- **Frontend**: http://localhost:5173 (React + Vite)
- **Backend**: http://localhost:3001 (Express.js)

The Vite dev server proxies all `/api/*` requests to the backend, so the frontend never needs to know the backend port.

> ⚠️ **Important:** `node_modules` must be installed on your own machine — never use sandbox-installed node_modules on a different OS/architecture (e.g. Linux sandbox → macOS), as native binaries will be incompatible.

## Architecture overview

```
client/   React SPA (Vite)
  └── src/
      ├── context/          CartContext, LanguageContext (i18n)
      ├── pages/            One file per route/view
      └── i18n/             Translation strings (en, no, it)

server/   Express.js REST API (ES modules — "type": "module")
  ├── app.js                createApp() factory — imported by both index.js and tests
  ├── index.js              Entry point — calls initializeDatabase() then app.listen()
  ├── db.js                 DatabaseWrapper over sql.js + initializeDatabase()
  ├── logger.js             Three Winston loggers: technical, business, per-order
  ├── data/seed.sql         Schema + 50 sample products — loaded on every startup
  ├── routes/               products.js, orders.js, payments.js, logs.js
  ├── middleware/           requestLogger.js
  ├── public/images/        Product images (.jpg + .svg fallback)
  └── logs/                 Generated at runtime (technical.log, business.log, orders/)
```

## Database

The database is **in-memory SQLite** using `sql.js` (pure JS — no native binaries). It is re-created from `server/data/seed.sql` every time the server starts.

- **All data is lost on server restart** — this is intentional for the course.
- The `DatabaseWrapper` class in `db.js` provides a `better-sqlite3`-compatible API (`.prepare().get/all/run()`).
- Import the db in routes with: `import db from '../db.js'`

Schema tables: `products`, `orders`, `order_items`, `payments`

All field names in the DB and API are **snake_case**. The frontend must use snake_case when reading API responses (e.g. `product.piece_count`, `order.customer_name`, `order.total_amount`).

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (supports `?category=` and `?minPrice=`/`?maxPrice=` filters) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/orders` | List orders (supports `?status=` filter) |
| GET | `/api/orders/:id` | Get order with items |
| POST | `/api/orders` | Create order |
| PUT | `/api/orders/:id/status` | Update order status |
| POST | `/api/orders/:id/refund` | Process mock refund |
| GET | `/api/orders/:id/logs` | Get per-order log entries |
| POST | `/api/payments/process` | Mock payment (always succeeds) |
| GET | `/api/logs/:type` | Get log file contents (`technical` or `business`) |
| GET | `/health` | Health check |

## Order status workflow

Valid transitions are enforced on the backend:

```
pending → confirmed → shipped → delivered → awaiting_return → returned
pending → canceled
confirmed → canceled
```

Canceled and returned orders can be refunded via `POST /api/orders/:id/refund`.

## Logging

Three Winston loggers are exported from `server/logger.js`:

```js
import { technicalLogger, businessLogger, orderLogger } from '../logger.js'

technicalLogger.info('...')        // → server/logs/technical.log
businessLogger.info('...')         // → server/logs/business.log
orderLogger(orderId).info('...')   // → server/logs/orders/{id}.log
```

In `NODE_ENV=development` (set by `npm run dev`), all loggers also print to the console.

## Intentional simplifications

- **Payment** is fully mocked — `POST /api/payments/process` always returns `{ success: true }`.
- **No authentication** — the admin section at `/admin` is open to everyone.
- **In-memory DB** — resets on every restart; no persistence.
- **Currency** — all prices are in Norwegian Krone (kr). 25% MVA (VAT) is added at checkout.

## Testing

```bash
npm test            # run once
npm run test:watch  # watch mode
```

Tests live in `server/tests/` and use Vitest + Supertest. The app is testable because `app.js` exports `createApp()` separately from `index.js`, so tests can import the app without starting the server.
