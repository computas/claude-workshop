import express from 'express';
import db from '../db.js';
import { technicalLogger } from '../logger.js';

const router = express.Router();

// GET /api/products - List all products with filtering
router.get('/', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const products = stmt.all(...params);

    res.json(products);
  } catch (error) {
    technicalLogger.error('Error fetching products', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = stmt.get(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    technicalLogger.error('Error fetching product', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - Create product (admin)
router.post('/', (req, res) => {
  try {
    const { name, description, price, image_url, category, age_range, piece_count, in_stock } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const stmt = db.prepare(
      `INSERT INTO products (name, description, price, image_url, category, age_range, piece_count, in_stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const result = stmt.run(
      name,
      description || null,
      price,
      image_url || null,
      category || null,
      age_range || null,
      piece_count || null,
      in_stock !== undefined ? (in_stock ? 1 : 0) : 1
    );

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

    technicalLogger.info('Product created', { productId: result.lastInsertRowid, name });
    res.status(201).json(product);
  } catch (error) {
    technicalLogger.error('Error creating product', { error: error.message });
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product (admin)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category, age_range, piece_count, in_stock } = req.body;

    // Check if product exists
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const stmt = db.prepare(
      `UPDATE products SET
       name = ?, description = ?, price = ?, image_url = ?,
       category = ?, age_range = ?, piece_count = ?, in_stock = ?
       WHERE id = ?`
    );

    stmt.run(
      name !== undefined ? name : product.name,
      description !== undefined ? description : product.description,
      price !== undefined ? price : product.price,
      image_url !== undefined ? image_url : product.image_url,
      category !== undefined ? category : product.category,
      age_range !== undefined ? age_range : product.age_range,
      piece_count !== undefined ? piece_count : product.piece_count,
      in_stock !== undefined ? (in_stock ? 1 : 0) : product.in_stock,
      id
    );

    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);

    technicalLogger.info('Product updated', { productId: id, name: updatedProduct.name });
    res.json(updatedProduct);
  } catch (error) {
    technicalLogger.error('Error updating product', { error: error.message });
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product (admin)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    stmt.run(id);

    technicalLogger.info('Product deleted', { productId: id, name: product.name });
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    technicalLogger.error('Error deleting product', { error: error.message });
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
