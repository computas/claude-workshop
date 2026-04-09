# LEGO Shop - React Frontend

A complete React + Vite frontend for a LEGO e-commerce shopping website with admin dashboard functionality.

## Features

- **Product Catalog**: Browse LEGO sets with search and filtering capabilities
- **Shopping Cart**: Add/remove items, manage quantities
- **Checkout**: Complete order with shipping and invoice addresses
- **Admin Dashboard**: Manage products, orders, and view logs
- **Multi-language Support**: English, Norwegian, and Italian
- **Modern Design**: Clean, responsive UI with LEGO branding colors

## Project Structure

```
client/
├── index.html                    # Entry HTML file
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Main app with routes
│   ├── App.css                  # Complete styling
│   ├── components/
│   │   └── Header.jsx           # Navigation header
│   ├── context/
│   │   ├── CartContext.jsx      # Shopping cart state
│   │   └── LanguageContext.jsx  # i18n state
│   ├── i18n/
│   │   └── translations.js      # Multi-language strings
│   └── pages/
│       ├── ProductCatalog.jsx   # Product listing
│       ├── ProductDetail.jsx    # Single product view
│       ├── Cart.jsx             # Shopping cart
│       ├── Checkout.jsx         # Order checkout form
│       ├── OrderConfirmation.jsx # Order confirmation
│       ├── AdminDashboard.jsx   # Admin overview
│       ├── AdminProducts.jsx    # Product management
│       ├── AdminOrders.jsx      # Order management
│       ├── AdminOrderDetail.jsx # Order details & status
│       └── AdminLogs.jsx        # System logs viewer
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building

```bash
npm run build
```

Output will be in the `dist/` directory.

## Configuration

The vite.config.js sets up a proxy to the backend API at `localhost:3001`:
- All `/api` requests are forwarded to the backend server

## API Integration

The frontend expects the following API endpoints:

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id` - Update order status (admin)
- `POST /api/orders/:id/refund` - Refund order (admin)
- `GET /api/orders/:id/logs` - Get order logs

### Payments
- `POST /api/payments/process` - Process payment

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics

### Logs
- `GET /api/logs` - Get system logs
- `POST /api/logs/open-directory` - Open logs directory

## Styling

The app uses CSS variables for theming:
- Primary Yellow: `#FFD700`
- Secondary Red: `#E3000B`
- Background: `#F5F5F5`

All styles are contained in `src/App.css` with a mobile-responsive design.

## Features

### Shopping
- Product search and filtering
- Category and price range filters
- Quantity selection
- Shopping cart management
- Order checkout with address entry
- Payment processing simulation
- Order confirmation

### Admin Panel
- Product CRUD operations
- Order status management
- Order refund processing
- Real-time order logs
- System logs viewer
- Dashboard statistics

### Internationalization
- Language switching (EN/NO/IT)
- Persistent language preference
- Browser language detection
- Complete translation coverage

### State Management
- React Context for cart state
- Context for language selection
- Local storage for preferences

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

## Notes

- The cart state is stored in memory during the session
- Language preference is saved to localStorage
- All API calls use axios with proper error handling
- Responsive design supports mobile, tablet, and desktop
