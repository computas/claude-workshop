import { describe, it, expect, beforeAll } from 'vitest';
import { initializeDatabase } from '../db.js';
import db from '../db.js';

describe('Database Module', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  it('should initialize database successfully', async () => {
    // If we reach here without error, initialization worked
    expect(db).toBeDefined();
  });

  it('should have all 4 tables created', () => {
    // Get table names from the result (excluding sqlite_sequence)
    const tableResults = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
    const tableNames = tableResults.map(row => row.name);

    expect(tableNames).toContain('products');
    expect(tableNames).toContain('orders');
    expect(tableNames).toContain('order_items');
    expect(tableNames).toContain('payments');
    expect(tableNames.length).toBe(4);
  });

  it('should have 50 products in the database', () => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM products');
    const result = stmt.get();
    expect(result.count).toBe(50);
  });

  it('products should have correct schema with all fields', () => {
    const product = db.prepare('SELECT * FROM products LIMIT 1').get();

    expect(product).toBeDefined();
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('description');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('image_url');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('age_range');
    expect(product).toHaveProperty('piece_count');
    expect(product).toHaveProperty('in_stock');
    expect(product).toHaveProperty('created_at');
  });

  it('should have products spanning 10 categories with 5 each', () => {
    const stmt = db.prepare(
      'SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY category'
    );
    const results = stmt.all();

    expect(results.length).toBe(10);
    results.forEach(row => {
      expect(row.count).toBe(5);
    });

    const categories = results.map(row => row.category);
    expect(categories).toContain('City');
    expect(categories).toContain('Technic');
    expect(categories).toContain('Star Wars');
    expect(categories).toContain('Creator');
    expect(categories).toContain('Friends');
    expect(categories).toContain('Architecture');
    expect(categories).toContain('Ideas');
    expect(categories).toContain('Speed Champions');
    expect(categories).toContain('Marvel');
    expect(categories).toContain('Ninjago');
  });

  it('should have correct price range (149-2999 NOK)', () => {
    const minPriceStmt = db.prepare('SELECT MIN(price) as min_price FROM products');
    const maxPriceStmt = db.prepare('SELECT MAX(price) as max_price FROM products');

    const minResult = minPriceStmt.get();
    const maxResult = maxPriceStmt.get();

    expect(minResult.min_price).toBe(149);
    expect(maxResult.max_price).toBe(2999);
  });

  it('should have orders table with correct structure', () => {
    const order = db.prepare('SELECT * FROM orders LIMIT 1');
    const info = db.prepare('PRAGMA table_info(orders)').all();

    const columns = info.map(col => col.name);
    expect(columns).toContain('id');
    expect(columns).toContain('status');
    expect(columns).toContain('customer_name');
    expect(columns).toContain('customer_email');
    expect(columns).toContain('shipping_address_line1');
    expect(columns).toContain('total_amount');
    expect(columns).toContain('payment_id');
    expect(columns).toContain('created_at');
    expect(columns).toContain('updated_at');
  });

  it('should have order_items table with correct structure', () => {
    const info = db.prepare('PRAGMA table_info(order_items)').all();
    const columns = info.map(col => col.name);

    expect(columns).toContain('id');
    expect(columns).toContain('order_id');
    expect(columns).toContain('product_id');
    expect(columns).toContain('product_name');
    expect(columns).toContain('quantity');
    expect(columns).toContain('unit_price');
  });

  it('should have payments table with correct structure', () => {
    const info = db.prepare('PRAGMA table_info(payments)').all();
    const columns = info.map(col => col.name);

    expect(columns).toContain('id');
    expect(columns).toContain('order_id');
    expect(columns).toContain('amount');
    expect(columns).toContain('status');
    expect(columns).toContain('payment_method');
    expect(columns).toContain('created_at');
  });
});
