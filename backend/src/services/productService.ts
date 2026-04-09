import type { Product } from '@workshop/shared';
import { getDb } from '../database/db.js';

interface DbProduct {
  id: number;
  set_number: string;
  name: string;
  name_no: string;
  theme: string;
  pieces: number;
  price: number;
  description: string;
  description_no: string;
  image_url: string;
  stock: number;
  age_min: number;
}

function toProduct(row: DbProduct): Product {
  return {
    id: row.id,
    setNumber: row.set_number,
    name: row.name,
    nameNo: row.name_no,
    theme: row.theme,
    pieces: row.pieces,
    price: row.price,
    description: row.description,
    descriptionNo: row.description_no,
    imageUrl: row.image_url,
    stock: row.stock,
    ageMin: row.age_min,
  };
}

export function getAllProducts(theme?: string): Product[] {
  const db = getDb();
  if (theme) {
    const rows = db.prepare('SELECT * FROM products WHERE theme = ?').all(theme) as DbProduct[];
    return rows.map(toProduct);
  }
  const rows = db.prepare('SELECT * FROM products ORDER BY name').all() as DbProduct[];
  return rows.map(toProduct);
}

export function getProductById(id: number): Product | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as DbProduct | undefined;
  return row ? toProduct(row) : null;
}

// INTENTIONAL BUG: SQL injection vulnerability — search term is interpolated directly
export function searchProducts(query: string): Product[] {
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM products WHERE name LIKE '%${query}%' OR name_no LIKE '%${query}%' OR theme LIKE '%${query}%'`).all() as DbProduct[];
  return rows.map(toProduct);
}

export function getThemes(): string[] {
  const db = getDb();
  const rows = db.prepare('SELECT DISTINCT theme FROM products ORDER BY theme').all() as { theme: string }[];
  return rows.map(r => r.theme);
}

export function updateStock(productId: number, delta: number): void {
  const db = getDb();
  db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(delta, productId);
}
