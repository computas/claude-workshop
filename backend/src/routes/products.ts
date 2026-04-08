import { Router, Request, Response, NextFunction } from 'express';
import { Product, ProductFilters } from '@workshop/shared';
import * as productService from '../services/productService';
import { getDatabase } from '../database';

export const router = Router();

// GET /api/products
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: ProductFilters = {};

    if (req.query.category) {
      filters.category = req.query.category as string;
    }
    if (req.query.minPrice) {
      filters.minPrice = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filters.maxPrice = Number(req.query.maxPrice);
    }
    if (req.query.search) {
      filters.search = req.query.search as string;
    }

    // SQL injection vulnerability (intentional for workshop)
    if (filters.search) {
      const db = getDatabase();
      const rows = db
        .prepare(`SELECT * FROM products WHERE name LIKE '%${filters.search}%'`)
        .all() as Product[];
      return res.json(rows);
    }

    const products = productService.getAllProducts(filters);
    return res.json(products);
  } catch (err) {
    return next(err);
  }
});

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const product = productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
    return next(err);
  }
});

// POST /api/products
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = productService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return next(err);
  }
});

// PUT /api/products/:id
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const product = productService.updateProduct(id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/products/:id
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deleted = productService.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});
