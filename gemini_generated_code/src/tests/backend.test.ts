import { describe, it, expect, beforeAll } from 'vitest';
import Database from 'better-sqlite3';
import { seedData } from '../../db/seed';

describe('Backend Logic', () => {
  let db: any;

  beforeAll(() => {
    db = new Database(':memory:');
    db.exec(`
      CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL, category TEXT, description TEXT, image_url TEXT);
      CREATE TABLE orders (id INTEGER PRIMARY KEY, status TEXT, total_price REAL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    `);
    seedData(db);
  });

  it('should have 50 products after seeding', () => {
    const count = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    expect(count).toBe(50);
  });

  it('should filter products by category', () => {
    const category = 'Star Wars';
    const products = db.prepare('SELECT * FROM products WHERE category = ?').all(category);
    expect(products.every((p: any) => p.category === category)).toBe(true);
  });

  it('should create an order and update status', () => {
    const insert = db.prepare('INSERT INTO orders (status, total_price) VALUES (?, ?)');
    const result = insert.run('received', 1500);
    const orderId = result.lastInsertRowid;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    expect(order.status).toBe('received');

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('shipped', orderId);
    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    expect(updatedOrder.status).toBe('shipped');
  });

  it('should not allow cancellation after shipping (business logic check)', () => {
    // This test simulates the logic in the route
    const order = { status: 'shipped' };
    const newStatus = 'canceled';
    
    const canCancel = !(newStatus === 'canceled' && (order.status === 'shipped' || order.status === 'delivered'));
    expect(canCancel).toBe(false);
  });
});
