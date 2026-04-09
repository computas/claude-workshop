import { Router } from 'express';
import { getAllProducts, getProductById, searchProducts, getThemes } from '../services/productService.js';

const router = Router();

router.get('/', (req, res, next) => {
  try {
    const { theme, search } = req.query as { theme?: string; search?: string };

    if (search) {
      // INTENTIONAL BUG: SQL injection — searchProducts uses raw string interpolation
      const products = searchProducts(search);
      res.json(products);
      return;
    }

    const products = getAllProducts(theme);
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get('/themes', (_req, res, next) => {
  try {
    res.json(getThemes());
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const product = getProductById(id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;
