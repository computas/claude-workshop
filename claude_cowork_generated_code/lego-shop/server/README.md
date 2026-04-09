# Lego Shop Backend

Express.js backend for the Lego shopping website with SQLite database, comprehensive logging, and order management.

## Setup

```bash
npm install
npm start
```

Or for development:

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Architecture

### Database (db.js)
- Uses better-sqlite3 for in-memory database
- Initializes from `data/seed.sql` on startup
- Tables: products, orders, order_items, payments

### Logging (logger.js)
- **technicalLogger**: HTTP calls, server startup, errors → `logs/technical.log`
- **businessLogger**: Order creation, status changes, payments → `logs/business.log`
- **orderLogger(orderId)**: Per-order events → `logs/orders/{orderId}.log`

### Middleware (middleware/requestLogger.js)
- Logs every HTTP request (method, URL, status, duration)

## API Endpoints

### Products (`/api/products`)

**GET /api/products**
- List all products with optional filtering
- Query params: `?category=` `&search=` `&minPrice=` `&maxPrice=`
- Response: Array of products

**GET /api/products/:id**
- Get single product by ID
- Response: Product object

**POST /api/products** (Admin)
- Create new product
- Body: `{ name, description, price, image_url, category, age_range, piece_count, in_stock }`

**PUT /api/products/:id** (Admin)
- Update product
- Body: Partial product object

**DELETE /api/products/:id** (Admin)
- Delete product
- Response: Deleted product object

### Orders (`/api/orders`)

**GET /api/orders**
- List all orders with optional status filter
- Query params: `?status=pending|confirmed|shipped|delivered|canceled|awaiting_return|returned`
- Response: Array of orders

**GET /api/orders/:id**
- Get single order with items
- Response: Order object with nested items array

**POST /api/orders**
- Create new order (creates order + items + payment record)
- Body:
  ```json
  {
    "customer_name": "string",
    "customer_email": "string",
    "shipping_address_line1": "string",
    "shipping_address_line2": "string (optional)",
    "shipping_city": "string",
    "shipping_zip": "string",
    "shipping_country": "string",
    "invoice_address_line1": "string",
    "invoice_address_line2": "string (optional)",
    "invoice_city": "string",
    "invoice_zip": "string",
    "invoice_country": "string",
    "items": [
      {
        "product_id": "number",
        "quantity": "number",
        "unit_price": "number"
      }
    ]
  }
  ```

**PUT /api/orders/:id/status**
- Update order status with validation
- Body: `{ "status": "confirmed|shipped|delivered|canceled|awaiting_return|returned" }`
- Valid transitions:
  - pending → confirmed, canceled
  - confirmed → shipped, canceled
  - shipped → delivered
  - delivered → awaiting_return
  - awaiting_return → returned
  - canceled, returned → (no transitions)

**POST /api/orders/:id/refund**
- Refund payment (only for canceled or returned orders)
- Response: Updated payment object

**GET /api/orders/:id/logs**
- Get order-specific logs
- Response: Array of log entries

### Payments (`/api/payments`)

**POST /api/payments/process**
- Simulated payment processing (always succeeds after 500ms delay)
- Body: `{ "order_id": "number", "amount": "number", "payment_method": "string (optional)" }`
- Response: Payment object with status "processing"

**POST /api/payments/:id/refund**
- Simulated refund processing (500ms delay)
- Response: Payment object with status "refunding"

### Logs (`/api/logs`)

**GET /api/logs/technical**
- Read technical log file
- Query params: `?lines=100` (default: last 100 lines)
- Response: Array of log entries

**GET /api/logs/business**
- Read business log file
- Query params: `?lines=100` (default: last 100 lines)
- Response: Array of log entries

**GET /api/logs/orders/:orderId**
- Read order-specific log
- Response: Array of log entries for the order

**POST /api/logs/open-directory**
- Opens logs directory in OS file manager
- Supports macOS (open), Linux (xdg-open), Windows (explorer)
- Response: Confirmation with logs path

## Product Database

Sample products included:
- Classic Bricks Set - $29.99
- Space Station - $89.99
- Medieval Castle - $149.99
- City Street Scene - $59.99
- Pirate Ship - $119.99
- Dinosaur Park - $39.99
- Robot Factory - $44.99
- Underwater World - $79.99

## Order Status Flow

```
pending ──→ confirmed ──→ shipped ──→ delivered ──→ awaiting_return ──→ returned
   │
   └──────────────────────────────────────────────→ canceled
         (if not yet shipped)
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 404: Not found
- 500: Server error

Error response format:
```json
{
  "error": "Error message"
}
```

## Logging Examples

### Technical Log
```json
{
  "timestamp": "2024-04-09 10:30:15",
  "level": "info",
  "message": "HTTP Request",
  "method": "GET",
  "url": "/api/products",
  "status": 200,
  "duration": "5ms"
}
```

### Business Log
```json
{
  "timestamp": "2024-04-09 10:30:20",
  "level": "info",
  "message": "Order created",
  "orderId": 1,
  "customer_name": "John Doe",
  "totalAmount": 299.99,
  "itemCount": 2
}
```

### Order Log
```json
{
  "timestamp": "2024-04-09 10:30:25",
  "level": "info",
  "message": "Status changed",
  "fromStatus": "pending",
  "toStatus": "confirmed"
}
```

## Database Schema

### products
- id (INTEGER PRIMARY KEY)
- name (TEXT NOT NULL)
- description (TEXT)
- price (REAL NOT NULL)
- image_url (TEXT)
- category (TEXT)
- age_range (TEXT)
- piece_count (INTEGER)
- in_stock (INTEGER - boolean)
- created_at (DATETIME)

### orders
- id (INTEGER PRIMARY KEY)
- status (TEXT - enum)
- customer_name (TEXT NOT NULL)
- customer_email (TEXT NOT NULL)
- shipping_address_line1 (TEXT NOT NULL)
- shipping_address_line2 (TEXT)
- shipping_city (TEXT NOT NULL)
- shipping_zip (TEXT NOT NULL)
- shipping_country (TEXT NOT NULL)
- invoice_address_line1 (TEXT NOT NULL)
- invoice_address_line2 (TEXT)
- invoice_city (TEXT NOT NULL)
- invoice_zip (TEXT NOT NULL)
- invoice_country (TEXT NOT NULL)
- total_amount (REAL NOT NULL)
- payment_id (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)

### order_items
- id (INTEGER PRIMARY KEY)
- order_id (INTEGER FOREIGN KEY)
- product_id (INTEGER FOREIGN KEY)
- product_name (TEXT NOT NULL)
- quantity (INTEGER NOT NULL)
- unit_price (REAL NOT NULL)

### payments
- id (TEXT PRIMARY KEY)
- order_id (INTEGER FOREIGN KEY)
- amount (REAL NOT NULL)
- status (TEXT - enum: pending, completed, refunded)
- payment_method (TEXT)
- created_at (DATETIME)

## CORS

CORS is enabled for `http://localhost:5173` (default Vite dev server)

## Static Files

Product images should be placed in `server/public/images/`

## Development Notes

- The database is in-memory, so data is reset on server restart
- Payment processing is simulated with a 500ms delay for realism
- All business events are logged to both business log and order-specific log
- Request logging includes timing information for performance monitoring
