import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../services/cartService.js';

const router = Router();

router.get('/:sessionId', (req, res, next) => {
  try {
    const cart = getCart(req.params.sessionId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.post('/:sessionId/items', (req, res, next) => {
  try {
    const { productId, quantity } = req.body as { productId: number; quantity: number };
    if (!productId || !quantity) {
      res.status(400).json({ error: 'productId and quantity are required' });
      return;
    }
    const cart = addToCart(req.params.sessionId, productId, quantity);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.put('/:sessionId/items/:productId', (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body as { quantity: number };
    const cart = updateCartItem(req.params.sessionId, productId, quantity);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

router.delete('/:sessionId/items/:productId', (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const cart = removeFromCart(req.params.sessionId, productId);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

export default router;
