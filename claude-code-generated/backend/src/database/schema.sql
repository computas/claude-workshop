CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  set_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_no TEXT NOT NULL,
  theme TEXT NOT NULL,
  pieces INTEGER NOT NULL,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  description_no TEXT NOT NULL,
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 10,
  age_min INTEGER NOT NULL DEFAULT 8
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(session_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  shipping_address TEXT NOT NULL,
  billing_address TEXT NOT NULL,
  total INTEGER NOT NULL,
  transaction_id TEXT,
  refunded INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL
);
