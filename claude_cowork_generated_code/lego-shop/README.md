# LEGO Shop — Course Example Application

A full-stack example application for a LEGO shopping website, built with React (Vite) on the frontend and Express.js on the backend. Uses an in-memory SQLite database seeded from a SQL file on startup.

> **Note:** This is a simplified course example. Some features (payment processing, user authentication) are intentionally mocked.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Node.js, Express.js (ES modules) |
| Database | SQLite in-memory via `sql.js` (seeded from `server/data/seed.sql`) |
| Logging | Winston (technical + business + per-order logs) |
| Testing | Vitest, Supertest |

---

## Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

---

## Getting Started

### 1. Install dependencies

From the project root, install both server and client dependencies in one step:

```bash
npm run install:all
```

Or install them separately:

```bash
cd server && npm install
cd ../client && npm install
```

### 2. Start the application

From the project root, start both the backend and frontend together:

```bash
npm run dev
```

This runs both servers concurrently:

- **Backend** → http://localhost:3001
- **Frontend** → http://localhost:5173

Navigate to http://localhost:5173 in your browser.

---

## Running Separately

If you prefer to start the backend and frontend in separate terminals:

**Backend only:**
```bash
npm run server
# or: cd server && npm run dev
```

**Frontend only:**
```bash
npm run client
# or: cd client && npm run dev
```

---

## Project Structure

```
lego-shop/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── context/            # CartContext, LanguageContext
│   │   ├── pages/              # ProductCatalog, Cart, Checkout, Admin...
│   │   └── main.jsx
│   └── vite.config.js          # Proxies /api → localhost:3001
│
├── server/                     # Express backend
│   ├── data/
│   │   └── seed.sql            # Database schema + 50 sample products
│   ├── logs/                   # Generated log files
│   ├── public/
│   │   └── images/products/    # Product images (.jpg + .svg fallbacks)
│   ├── routes/                 # products, orders, payments, logs
│   ├── tests/                  # Vitest + Supertest test suites
│   ├── app.js                  # Express app factory (createApp)
│   ├── db.js                   # sql.js DatabaseWrapper + initializeDatabase()
│   ├── index.js                # Server entry point
│   └── logger.js               # Winston logger setup
│
├── download-product-images.js  # Script to fetch real LEGO images
└── package.json                # Root scripts (uses concurrently)
```

---

## Features

### Customer-facing
- **Product catalog** — browse, search, filter by category and price
- **Product detail** page with image, description, and piece count
- **Shopping cart** — add/remove items, adjust quantities
- **Checkout** — shipping + invoice address, simulated card payment
- **Order confirmation** page
- **Multi-language** — Norwegian 🇳🇴, English 🇬🇧, Italian 🇮🇹 (auto-detected from browser locale, falls back to English)

### Admin section (`/admin`)
- **Products** — create, edit, and delete products
- **Orders** — list and filter orders by status; update order status
- **Order detail** — full order info, status workflow, per-order and technical logs
- **Logs viewer** — view technical or business logs with configurable line limit
- **Open logs folder** button — opens the `server/logs/` directory in Finder/Explorer

### Order status workflow

```
received → confirmed → shipped → delivered
                    ↘ canceled  (only before shipped)
delivered ↘ awaiting_return → returned
```

Canceled and returned orders support a mock refund action.

---

## Database

The database is **in-memory SQLite**, initialized from `server/data/seed.sql` every time the server starts. It contains:

- 50 sample LEGO products with names, descriptions, prices (100–3000 kr), categories, and images
- Empty `orders`, `order_items`, and `payments` tables

Because the database is in-memory, **all orders are lost when the server restarts**. This is intentional for a course example.

---

## Product Images

Product images are stored in `server/public/images/products/`. Two formats are provided:

- `product-{id}.jpg` — real LEGO set photos (downloaded via `download-product-images.js`)
- `product-{id}.svg` — generated illustrated box-art (shown as fallback if the JPG is missing)

To re-download the real images:
```bash
node download-product-images.js
```

---

## Running Tests

```bash
# Run all backend tests once
npm test

# Run in watch mode
npm run test:watch
```

Tests are located in `server/tests/` and cover products, orders, payments, and database logic.

---

## Logs

The backend writes logs to `server/logs/`:

| File | Contents |
|------|----------|
| `technical.log` | HTTP requests, server startup, errors |
| `business.log` | Order created, status changed, payments |
| `order-{id}.log` | Per-order business events |

Logs can also be viewed from the **Admin → Logs** page in the UI, or by clicking the "Open logs folder" button in the admin header.

---

## Notes for Course Use

- **Payment** is fully mocked — no real payment gateway is contacted.
- **Authentication** is not implemented — the admin section at `/admin` is open to all users.
- The in-memory database resets on every server restart by design.
- Prices are in Norwegian Krone (kr) with 25% MVA (VAT) applied at checkout.
