import type { Cart, CartItem } from '@workshop/shared';
import { getDb } from '../database/db.js';
import { getProductById } from './productService.js';

interface DbCartItem {
  id: number;
  session_id: string;
  product_id: number;
  quantity: number;
}

export function getCart(sessionId: string): Cart {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM cart_items WHERE session_id = ?').all(sessionId) as DbCartItem[];

  const items: CartItem[] = [];
  for (const row of rows) {
    const product = getProductById(row.product_id);
    if (product) {
      items.push({ productId: row.product_id, product, quantity: row.quantity });
    }
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { sessionId, items, total };
}

export function addToCart(sessionId: string, productId: number, quantity: number): Cart {
  const db = getDb();
  const product = getProductById(productId);
  if (!product) throw new Error(`Product ${productId} not found`);
  if (product.stock < quantity) throw new Error('Insufficient stock');

  const existing = db.prepare('SELECT * FROM cart_items WHERE session_id = ? AND product_id = ?').get(sessionId, productId) as DbCartItem | undefined;

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE session_id = ? AND product_id = ?').run(quantity, sessionId, productId);
  } else {
    db.prepare('INSERT INTO cart_items (session_id, product_id, quantity) VALUES (?, ?, ?)').run(sessionId, productId, quantity);
  }

  return getCart(sessionId);
}

export function updateCartItem(sessionId: string, productId: number, quantity: number): Cart {
  const db = getDb();
  if (quantity <= 0) {
    db.prepare('DELETE FROM cart_items WHERE session_id = ? AND product_id = ?').run(sessionId, productId);
  } else {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE session_id = ? AND product_id = ?').run(quantity, sessionId, productId);
  }
  return getCart(sessionId);
}

export function removeFromCart(sessionId: string, productId: number): Cart {
  const db = getDb();
  db.prepare('DELETE FROM cart_items WHERE session_id = ? AND product_id = ?').run(sessionId, productId);
  return getCart(sessionId);
}

export function clearCart(sessionId: string): void {
  const db = getDb();
  db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(sessionId);
}
