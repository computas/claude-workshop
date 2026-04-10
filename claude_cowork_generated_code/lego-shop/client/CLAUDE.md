# Client — Frontend Context

React 18 SPA built with Vite. Runs on **port 5173**. All `/api/*` requests are proxied to the backend at port 3001 (configured in `vite.config.js`) — so API calls in the code use relative paths like `/api/products`.

## Routing (`src/App.jsx`)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `ProductCatalog` | Browse and filter products |
| `/product/:id` | `ProductDetail` | Single product view |
| `/cart` | `Cart` | Shopping cart |
| `/checkout` | `Checkout` | Address + payment form |
| `/order-confirmation/:id` | `OrderConfirmation` | Post-purchase page |
| `/admin` | `AdminDashboard` | Stats overview |
| `/admin/products` | `AdminProducts` | Product CRUD |
| `/admin/orders` | `AdminOrders` | Order list with status filter |
| `/admin/orders/:id` | `AdminOrderDetail` | Order detail + status update + logs |
| `/admin/logs` | `AdminLogs` | View technical/business logs |

## Context providers (`src/context/`)

Providers wrap the whole app in this order (see `main.jsx`): `LanguageProvider` → `CartProvider`.

### `CartContext`
```js
const { items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, itemCount } = useCart()
// items: [{ product: {...}, quantity: number }]
// addToCart(product, quantity?)
// getTotal() returns subtotal (before tax)
```

### `LanguageContext`
```js
const { currentLanguage, setLanguage, t } = useLanguage()
// t('product.add_to_cart')   — dot-path lookup into src/i18n/translations.js
// setLanguage('no' | 'en' | 'it')
// Language is persisted to localStorage and auto-detected from navigator.language
```

## Adding a new page

1. Create `src/pages/MyPage.jsx`
2. Add a route in `src/App.jsx`
3. Use the standard pattern:

```jsx
import { useLanguage } from '../context/LanguageContext'
import axios from 'axios'

export default function MyPage() {
  const { t } = useLanguage()

  // fetch from backend
  const response = await axios.get('/api/something')

  return <div>...</div>
}
```

## API calls

Always use `axios` with relative `/api/...` paths — never hardcode `localhost:3001`.

```js
import axios from 'axios'

const products = await axios.get('/api/products')
const order = await axios.post('/api/orders', orderData)
```

## Field names

API responses use **snake_case**. Always use snake_case when reading from API data:

```js
product.image_url       ✓     product.imageUrl        ✗
product.piece_count     ✓     product.pieces          ✗
product.age_range       ✓     product.ageMin          ✗
product.in_stock        ✓     product.stock           ✗
order.customer_name     ✓     order.customerName      ✗
order.total_amount      ✓     order.total             ✗
order.created_at        ✓     order.createdAt         ✗
```

## Prices and currency

All prices are in Norwegian Krone. Format amounts consistently:

```js
// Display price
{product.price.toLocaleString('nb-NO')} kr

// At checkout: add 25% MVA (Norwegian VAT)
const total = subtotal * 1.25
```

## Product images

Images are served from the backend. Always prefix `image_url` with the backend origin:

```jsx
<img src={`http://localhost:3001${product.image_url}`} alt={product.name} />
```

Each product has a `.jpg` (real photo) and `.svg` (illustrated fallback). The backend serves `.svg` automatically if the `.jpg` is missing. Add an `onError` handler as a safety net:

```jsx
onError={(e) => { e.target.style.display = 'none' }}
```

## Translations (`src/i18n/translations.js`)

Add new translation keys to all three languages (`en`, `no`, `it`) at the same time. Access with `t('section.key')`.

## No authentication

There is no login system. The admin section is accessible to anyone navigating to `/admin`.
