import { Product, ProductFilters } from '@workshop/shared';
import { getDatabase } from '../database';

export function getAllProducts(filters: ProductFilters): Product[] {
  const db = getDatabase();
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.category) {
    conditions.push('category = ?');
    params.push(filters.category);
  }

  if (filters.minPrice !== undefined) {
    conditions.push('price >= ?');
    params.push(filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    conditions.push('price <= ?');
    params.push(filters.maxPrice);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM products ${where} ORDER BY id`;

  return db.prepare(sql).all(...params) as Product[];
}

export function getProductById(id: number): Product | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Product | undefined;
  return row ?? null;
}

export function createProduct(data: Omit<Product, 'id' | 'created_at'>): Product {
  const db = getDatabase();
  const result = db
    .prepare(
      `INSERT INTO products (name, description, price, category, image_url, stock, piece_count, age_min)
       VALUES (@name, @description, @price, @category, @image_url, @stock, @piece_count, @age_min)`
    )
    .run(data);

  return getProductById(result.lastInsertRowid as number) as Product;
}

export function updateProduct(
  id: number,
  data: Partial<Omit<Product, 'id' | 'created_at'>>
): Product | null {
  const db = getDatabase();

  const fields = Object.keys(data)
    .map((key) => `${key} = @${key}`)
    .join(', ');

  if (!fields) {
    return getProductById(id);
  }

  db.prepare(`UPDATE products SET ${fields} WHERE id = @id`).run({ ...data, id });

  return getProductById(id);
}

export function deleteProduct(id: number): boolean {
  const db = getDatabase();
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return result.changes > 0;
}
