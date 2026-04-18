# Lego Shop — Technical Architecture

## Domain Objects

### Product

Represents a LEGO set in the catalog. Defined in `shared/src/types.ts`, stored in the `products` table.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `setNumber` | `string` | Unique LEGO set ID (e.g. "75192") |
| `name` | `string` | English name |
| `nameNo` | `string` | Norwegian name |
| `theme` | `string` | Category (Star Wars, Technic, Icons…) |
| `pieces` | `number` | Number of pieces |
| `price` | `number` | Price in NOK |
| `description` | `string` | English description |
| `descriptionNo` | `string` | Norwegian description |
| `imageUrl` | `string` | External image URL |
| `stock` | `number` | Available inventory |
| `ageMin` | `number` | Minimum recommended age |

---

### CartItem

One product line within a cart session. Stored in `cart_items` table.

| Field | Type | Description |
|-------|------|-------------|
| `productId` | `number` | FK → Product.id |
| `product` | `Product` | Full product object (denormalized at read time) |
| `quantity` | `number` | Units in cart |

---

### Cart

The full shopping cart for a session. Not stored as a single row — computed from `cart_items` on every request.

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | `string` | Session identifier (from frontend localStorage) |
| `items` | `CartItem[]` | All items |
| `total` | `number` | Sum of (price × quantity) for all items |

---

### Order

A placed order. Stored in the `orders` table. Addresses are stored as JSON strings in the DB.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Primary key |
| `sessionId` | `string` | Session that placed the order |
| `status` | `OrderStatus` | Current lifecycle status |
| `items` | `OrderItem[]` | Snapshot of products at time of purchase |
| `shippingAddress` | `ShippingAddress` | Delivery address |
| `billingAddress` | `ShippingAddress` | Billing address |
| `total` | `number` | Total amount charged |
| `transactionId` | `string \| null` | Payment processor ID |
| `refunded` | `boolean` | Whether a refund was issued |
| `createdAt` | `string` | ISO timestamp |
| `updatedAt` | `string` | ISO timestamp |

---

### OrderItem

A snapshot of one product line at the time the order was placed. Stored in `order_items` table.

| Field | Type | Description |
|-------|------|-------------|
| `productId` | `number` | Reference to original product |
| `productName` | `string` | Name snapshot (does not change if product changes) |
| `quantity` | `number` | Units ordered |
| `unitPrice` | `number` | Price snapshot at order time |

---

### ShippingAddress

Embedded in `Order` as both `shippingAddress` and `billingAddress`.

| Field | Type |
|-------|------|
| `firstName` | `string` |
| `lastName` | `string` |
| `street` | `string` |
| `city` | `string` |
| `postalCode` | `string` |
| `country` | `string` |

---

### OrderStatus

A string union type controlling the order lifecycle:

```
'received' | 'confirmed' | 'canceled' | 'shipped' | 'delivered' | 'awaiting_return' | 'returned'
```

---

### PaymentResult

Returned by the (mocked) payment service.

| Field | Type | Description |
|-------|------|-------------|
| `success` | `boolean` | Whether the operation succeeded |
| `transactionId` | `string` | Generated transaction or refund ID |
| `message` | `string` | Human-readable result |

---

## Data Model Diagram

```mermaid
erDiagram
    products {
        int id PK
        text set_number UK
        text name
        text name_no
        text theme
        int pieces
        int price
        text description
        text description_no
        text image_url
        int stock
        int age_min
    }

    cart_items {
        int id PK
        text session_id
        int product_id FK
        int quantity
        text created_at
    }

    orders {
        int id PK
        text session_id
        text status
        text shipping_address
        text billing_address
        int total
        text transaction_id
        int refunded
        text created_at
        text updated_at
    }

    order_items {
        int id PK
        int order_id FK
        int product_id
        text product_name
        int quantity
        int unit_price
    }

    products ||--o{ cart_items : "referenced by"
    orders ||--o{ order_items : "contains"
    products ||--o{ order_items : "snapshot from"
```

---

## Order Status State Machine

```mermaid
stateDiagram-v2
    [*] --> received : createOrder()
    received --> confirmed : updateOrderStatus()
    received --> canceled : updateOrderStatus()
    confirmed --> shipped : updateOrderStatus()
    confirmed --> canceled : updateOrderStatus()
    canceled --> [*]
    shipped --> delivered : updateOrderStatus()
    shipped --> awaiting_return : updateOrderStatus()
    delivered --> awaiting_return : updateOrderStatus()
    awaiting_return --> returned : updateOrderStatus()
    returned --> [*]
```

Refund is allowed only when status is `canceled` or `returned`, and only if not already refunded.

---

## Architecture Layers

```mermaid
graph TD
    subgraph Frontend ["Frontend (React, port 5173)"]
        Pages["Pages"]
        Components["Components"]
        Context["AppContext (cart + language)"]
        Hooks["useCart / useLanguage"]
        ApiClients["api/ (products, cart, orders)"]
    end

    subgraph Backend ["Backend (Express, port 3001)"]
        Routes["Routes (thin handlers)"]
        Services["Services (business logic)"]
        DB["SQLite (in-memory)"]
    end

    subgraph Shared ["@workshop/shared"]
        Types["TypeScript types"]
    end

    Pages --> Components
    Pages --> Context
    Components --> Context
    Context --> Hooks
    Hooks --> ApiClients
    ApiClients -->|HTTP JSON| Routes
    Routes --> Services
    Services --> DB
    Frontend -.->|imports types| Shared
    Backend -.->|imports types| Shared
```

---

## Checkout Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant OR as OrdersRoute
    participant OS as orderService
    participant CS as cartService
    participant PS as paymentService
    participant ProdS as productService
    participant DB as SQLite

    FE->>OR: POST /orders (CheckoutPayload)
    OR->>OS: createOrder(sessionId, addresses, paymentToken)
    OS->>CS: getCart(sessionId)
    CS->>DB: SELECT cart_items JOIN products
    DB-->>CS: rows
    CS-->>OS: Cart
    OS->>PS: chargePayment(token, amount)
    PS-->>OS: PaymentResult {success: true, transactionId}
    OS->>DB: INSERT INTO orders
    OS->>DB: INSERT INTO order_items (per item)
    OS->>ProdS: updateStock(productId, -quantity) (per item)
    OS->>CS: clearCart(sessionId)
    CS->>DB: DELETE FROM cart_items
    OS-->>OR: Order
    OR-->>FE: 201 Order
```

---

## Cart Session Flow

```mermaid
sequenceDiagram
    participant LS as localStorage
    participant FE as Frontend (useCart)
    participant API as cartApi
    participant CR as CartRoute
    participant CS as cartService
    participant DB as SQLite

    FE->>LS: read 'lego_session_id'
    alt no session yet
        FE->>LS: write new sess_${timestamp}_${random}
    end
    FE->>API: getCart(sessionId)
    API->>CR: GET /cart/:sessionId
    CR->>CS: getCart(sessionId)
    CS->>DB: SELECT cart_items + products WHERE session_id = ?
    DB-->>CS: rows
    CS-->>CR: Cart {sessionId, items, total}
    CR-->>API: Cart
    API-->>FE: Cart (state updated)
```

---

## Service Dependencies

```mermaid
graph LR
    cartService -->|getProductById| productService
    orderService -->|getCart, clearCart| cartService
    orderService -->|chargePayment, refundPayment| paymentService
    orderService -->|updateStock| productService
    orderService -->|logOrderEvent| logger
```

---

## Known Issues in the Codebase

| # | Location | Issue |
|---|----------|-------|
| 1 | `backend/src/services/productService.ts` | `searchProducts()` uses string interpolation in SQL (`LIKE '%${query}%'`) — SQL injection vulnerability |
| 2 | `frontend/src/api/client.ts` | `BASE_URL` points to port `3002`, but the backend runs on port `3001` |

> These appear to be intentional workshop bugs based on the project's educational purpose.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | SQLite (in-memory, `better-sqlite3`) |
| Shared types | TypeScript (`@workshop/shared` workspace package) |
| E2E tests | Playwright |
| Internationalization | Custom i18n with `en`, `no`, `it` translations |
| Session persistence | Browser `localStorage` |
