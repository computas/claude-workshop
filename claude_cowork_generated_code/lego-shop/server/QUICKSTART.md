# Quick Start Guide

## Installation

From the `server` directory:

```bash
npm install
```

## Running the Server

### Production Mode
```bash
npm start
```

### Development Mode (with logging)
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Quick API Tests

### Create a Product (Admin)
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic Bricks Set",
    "description": "A classic set of colorful LEGO bricks",
    "price": 29.99,
    "category": "Building Sets",
    "age_range": "4+",
    "piece_count": 500,
    "in_stock": true
  }'
```

### Get All Products
```bash
curl http://localhost:3001/api/products
```

### Get All Products in a Category
```bash
curl "http://localhost:3001/api/products?category=Space"
```

### Search Products
```bash
curl "http://localhost:3001/api/products?search=castle"
```

### Filter by Price
```bash
curl "http://localhost:3001/api/products?minPrice=50&maxPrice=100"
```

### Create an Order
```bash
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "shipping_address_line1": "123 Main St",
    "shipping_city": "New York",
    "shipping_zip": "10001",
    "shipping_country": "USA",
    "invoice_address_line1": "123 Main St",
    "invoice_city": "New York",
    "invoice_zip": "10001",
    "invoice_country": "USA",
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "unit_price": 29.99
      }
    ]
  }'
```

### Get All Orders
```bash
curl http://localhost:3001/api/orders
```

### Get Order by ID (includes items)
```bash
curl http://localhost:3001/api/orders/1
```

### Update Order Status
```bash
curl -X PUT http://localhost:3001/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

### Process Payment
```bash
curl -X POST http://localhost:3001/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "amount": 59.98,
    "payment_method": "credit_card"
  }'
```

### Get Order Logs
```bash
curl http://localhost:3001/api/orders/1/logs
```

### Get Technical Logs
```bash
curl "http://localhost:3001/api/logs/technical?lines=50"
```

### Get Business Logs
```bash
curl "http://localhost:3001/api/logs/business?lines=50"
```

### Refund an Order (must be canceled or returned first)
```bash
# First cancel the order
curl -X PUT http://localhost:3001/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "canceled"}'

# Then refund it
curl -X POST http://localhost:3001/api/orders/1/refund
```

### Open Logs Directory
```bash
curl -X POST http://localhost:3001/api/logs/open-directory
```

## Directory Structure

```
server/
├── index.js                    # Main Express server
├── db.js                       # Database initialization
├── logger.js                   # Logging configuration
├── package.json                # Dependencies
├── data/
│   └── seed.sql               # Database schema and sample data
├── middleware/
│   └── requestLogger.js       # HTTP request logging middleware
├── routes/
│   ├── products.js            # Product CRUD routes
│   ├── orders.js              # Order management routes
│   ├── payments.js            # Payment processing routes
│   └── logs.js                # Log viewing routes
├── logs/                       # Generated log files
│   ├── technical.log          # HTTP and server logs
│   ├── business.log           # Business events
│   └── orders/                # Per-order logs
├── public/                     # Static files (product images)
└── node_modules/              # Dependencies (created by npm install)
```

## Database

The database is in-memory, so:
- All data resets when the server restarts
- No database file on disk
- Perfect for development and testing
- 8 sample products are loaded on startup

## Logs

Three log files are created automatically:

1. **technical.log** - HTTP requests, server startup, errors
2. **business.log** - Order creation, status changes, payments
3. **orders/{orderId}.log** - Per-order event history

Each log entry includes timestamp, level, message, and metadata in JSON format.

## Common Workflows

### 1. Browse Products
```bash
curl http://localhost:3001/api/products
```

### 2. Create and Process an Order
```bash
# Create order
ORDER=$(curl -s -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{...order data...}')

ORDER_ID=$(echo $ORDER | jq '.id')

# Process payment
curl -X POST http://localhost:3001/api/payments/process \
  -H "Content-Type: application/json" \
  -d "{\"order_id\": $ORDER_ID, \"amount\": 100, \"payment_method\": \"credit_card\"}"

# Confirm order
curl -X PUT http://localhost:3001/api/orders/$ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'

# Ship order
curl -X PUT http://localhost:3001/api/orders/$ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "shipped"}'

# Deliver order
curl -X PUT http://localhost:3001/api/orders/$ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'
```

### 3. View Order Events
```bash
curl http://localhost:3001/api/orders/1/logs
```

## Troubleshooting

### Port 3001 Already in Use
```bash
# Find what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Dependencies Not Installing
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Logs Not Appearing
- Check that the `logs/` directory exists (created automatically)
- Ensure server is running in development mode for console output: `npm run dev`
- Check file permissions in the logs directory

## Next Steps

1. Install frontend: `cd ../client && npm install`
2. Start frontend: `npm run dev`
3. Frontend will connect to backend at `http://localhost:3001`

For complete API documentation, see [README.md](./README.md)
