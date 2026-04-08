# CLAUDE.md

This file gives Claude Code full context to work effectively in this repository.

---

## Project Overview

A full-stack fantasy LEGO shopping cart app used as a workshop demo for teaching **context engineering** with Claude Code. The app lets customers browse, filter, and buy fantasy LEGO sets, and lets admins manage the product catalog.

| Layer | Tech | Port |
|-------|------|------|
| Frontend | React 18 + Vite + TypeScript | 5173 |
| Backend | Express + TypeScript | 3001 |
| Database | SQLite (better-sqlite3, in-memory) | — |
| Tests | Vitest (FE + BE), Playwright (E2E) | — |

The database is initialized **in-memory** on every backend startup from `backend/src/database/schema.sql` + `backend/src/database/seed.sql`. Data resets on restart — intentional for a demo app.

---

## Architecture

```
HTTP Request
  └─ Express Route (backend/src/routes/)       ← thin: validate input, call service, return JSON
       └─ Service (backend/src/services/)      ← thick: all business logic and DB queries
            └─ getDatabase() → better-sqlite3  ← singleton in-memory SQLite

React Component (frontend/src/components/)
  └─ Custom Hook (frontend/src/hooks/)         ← data fetching and state management
       └─ API Client (frontend/src/api/)       ← thin fetch wrappers calling the backend
            └─ HTTP → Backend /api/*
```

**Shared types** live in `shared/src/types.ts` and are imported by both FE and BE as `@workshop/shared`. This keeps interfaces in sync — if you change a type, both sides update.

**Cart** is client-side only (React Context + localStorage). Cart items are POSTed to `/api/orders` at checkout.

---

## Development Commands

Run from the **repo root**:

| Command | What it does |
|---------|-------------|
| `npm install` | Install all workspace dependencies |
| `npm run dev` | Start backend (3001) + frontend (5173) concurrently |
| `npm run test` | Run all Vitest unit tests (BE + FE) |
| `npm run typecheck` | TypeScript type-check all workspaces |
| `npm run lint` | ESLint all workspaces |
| `npm run build` | Build shared, backend, and frontend |
| `npm run test:e2e` | Run Playwright E2E tests |

Per-workspace (add `-w backend` or `-w frontend`):

```bash
npm run test -w backend        # backend unit tests only
npm run test:watch -w frontend # frontend tests in watch mode
npm run dev -w backend         # backend only
```

---

## File Structure

```
├── CLAUDE.md
├── package.json                  # Root: workspaces + orchestration scripts
├── tsconfig.base.json            # Shared TS compiler options
├── .gitattributes                # * text=auto eol=lf (cross-platform)
├── .claude/
│   ├── settings.json             # Allowed shell permissions
│   └── commands/                 # Slash commands: /fix-ci, /add-feature, /write-test
├── .github/workflows/
│   ├── ci.yml                    # Parallel: lint + typecheck + unit-tests
│   └── e2e.yml                   # Playwright E2E + trace artifacts on failure
├── shared/
│   └── src/types.ts              # ALL domain types — Product, Order, CartItem, etc.
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   ├── schema.sql        # Table definitions
│   │   │   ├── seed.sql          # 50 fantasy LEGO products
│   │   │   └── connection.ts     # In-memory SQLite singleton
│   │   ├── middleware/
│   │   │   ├── logger.ts         # Winston logger (console + logs/backend.log)
│   │   │   ├── requestLogger.ts  # Per-request logging middleware
│   │   │   └── errorHandler.ts   # Express error handler
│   │   ├── services/             # Business logic (no HTTP here)
│   │   │   ├── productService.ts
│   │   │   ├── orderService.ts
│   │   │   └── paymentService.ts
│   │   ├── routes/               # Thin HTTP handlers
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   ├── payments.ts
│   │   │   └── index.ts          # Assembles all routes under /api
│   │   └── index.ts              # Express app entry, exports app for testing
│   └── tests/
│       ├── services/             # Unit tests for services
│       └── routes/               # Integration tests using supertest
├── frontend/
│   ├── src/
│   │   ├── api/                  # Fetch wrappers (client.ts, products.ts, orders.ts, payments.ts)
│   │   ├── hooks/                # useCart, useProducts, useProduct
│   │   ├── components/
│   │   │   ├── layout/           # Header, Layout
│   │   │   ├── products/         # ProductCard, ProductList, ProductFilters
│   │   │   ├── cart/             # CartIcon, CartSummary
│   │   │   ├── checkout/         # CheckoutForm
│   │   │   └── admin/            # Dashboard, ProductTable, ProductForm
│   │   ├── pages/                # One file per route
│   │   └── styles/               # index.css (global), components.css
│   └── tests/
│       ├── components/           # @testing-library/react component tests
│       └── hooks/                # renderHook hook tests
└── e2e/                          # Playwright tests (products, checkout, admin)
```

---

## Backend API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/products | List products; query: `?category=&search=&minPrice=&maxPrice=` |
| GET | /api/products/:id | Single product |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |
| POST | /api/orders | Create order from cart |
| GET | /api/orders/:id | Get order with items |
| POST | /api/payments/simulate | Simulate payment (1s delay, always succeeds) |

---

## Code Conventions

### TypeScript
- Strict mode is on — no `any` without a comment explaining why
- Import from `@workshop/shared` for all domain types
- Never compare typed `number` values to string literals

### Naming
- Functions: `camelCase` (`getProductById`, `createOrder`)
- Components: `PascalCase` (`ProductCard`, `CheckoutForm`)
- Files: `camelCase` for TS/TSX, kebab-case is fine too — be consistent per directory
- Test files: `<module>.test.ts` or `<Component>.test.tsx`

### Imports
1. External packages (`react`, `express`, etc.)
2. `@workshop/shared` types
3. Internal imports (relative paths)

### Error handling
- Backend services throw `Error` for invalid states
- Routes catch errors with `try/catch` and call `next(err)` 
- The `errorHandler` middleware logs and returns `{ error: message }` with status 500
- Frontend: hooks expose `error: string | null` state from caught fetch errors

### Adding a new API endpoint
1. Add the business logic to `backend/src/services/`
2. Add the route handler in `backend/src/routes/`
3. Mount it in `backend/src/routes/index.ts` if it's a new router
4. Add the API client function in `frontend/src/api/`
5. Write a test in `backend/tests/`

### Adding a new React component
1. Create in `frontend/src/components/<domain>/ComponentName.tsx`
2. Add `data-testid` to interactive elements for testability
3. Keep components dumb — lift state to hooks or pages
4. Write a test in `frontend/tests/components/`

---

## Testing

### Strategy
- **Unit tests** (Vitest): test services and components in isolation
- **Integration tests** (Vitest + supertest): test HTTP endpoints against real in-memory DB
- **E2E tests** (Playwright): test complete user flows in a browser

### Backend unit tests
```typescript
// Pattern from backend/tests/services/productService.test.ts
import { describe, it, expect } from 'vitest';
import { getAllProducts } from '../../src/services/productService';

describe('productService', () => {
  it('returns all 50 products', () => {
    const products = getAllProducts({});
    expect(products).toHaveLength(50);
  });
});
```

The DB is seeded automatically when `getDatabase()` is called — no setup needed in tests.

### Frontend component tests
```typescript
// Pattern from frontend/tests/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('calls onAddToCart when button clicked', async () => {
  const onAddToCart = vi.fn();
  render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
  await userEvent.click(screen.getByTestId('add-to-cart-button'));
  expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
});
```

### Test file placement
```
src/services/productService.ts → tests/services/productService.test.ts
src/components/products/ProductCard.tsx → tests/components/ProductCard.test.tsx
src/hooks/useCart.ts → tests/hooks/useCart.test.ts
```

---

## Known Issues

| Issue | Location | Notes |
|-------|----------|-------|
| Wrong API port | `frontend/src/api/client.ts` line 2 | Port is 3002, should be 3001 — intentional for Exercise 2 |
| Empty dashboard | `frontend/src/components/admin/Dashboard.tsx` | Returns `<div>TODO: Dashboard</div>` — intentional for Exercise 5 |
| Missing order tests | `backend/tests/services/` | No `orderService.test.ts` — intentional for Exercises 4-5 |
| Incomplete cart tests | `backend/tests/services/cartService.test.ts` | Only covers happy path, missing edge cases |
| SQL injection | `backend/src/routes/products.ts` search path | Raw string concat in LIKE query — bonus discovery |

---

## CI/CD

### Workflows
- **ci.yml**: Runs on push to `main` and `workshop/**` branches. Three parallel jobs: `lint`, `typecheck`, `unit-tests`.
- **e2e.yml**: Runs on push to `main` only. Builds the app, runs Playwright, uploads trace artifacts on failure.

### Diagnosing CI failures

```bash
# List recent runs
gh run list --branch $(git branch --show-current)

# View failed job logs
gh run view <run-id> --log-failed

# Re-run failed jobs
gh run rerun <run-id> --failed
```

### Common CI failure causes
- **typecheck job fails**: TypeScript type error — look for `error TS` in the log
- **lint job fails**: ESLint rule violation — look for the rule name (e.g., `no-unused-vars`)
- **unit-tests job fails**: A `describe`/`it` block assertion failed — check the test output

### workshop/broken-ci branch
This branch has a deliberate TypeScript type error in `backend/src/services/orderService.ts` that causes the `typecheck` CI job to fail. Used in Exercise 4 to practice reading CI logs with `gh` CLI.
