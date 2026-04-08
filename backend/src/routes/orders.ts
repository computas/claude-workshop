import { Router, Request, Response, NextFunction } from 'express';
import * as orderService from '../services/orderService';

export const router = Router();

// POST /api/orders
router.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      items,
      total,
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_zip,
      billing_name,
      billing_address,
      billing_city,
      billing_zip,
      email,
    } = req.body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      total === undefined ||
      !shipping_name ||
      !shipping_address ||
      !shipping_city ||
      !shipping_zip ||
      !billing_name ||
      !billing_address ||
      !billing_city ||
      !billing_zip ||
      !email
    ) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const order = orderService.createOrder(req.body);
    return res.status(201).json(order);
  } catch (err) {
    return next(err);
  }
});

// GET /api/orders/:id
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const order = orderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.json(order);
  } catch (err) {
    return next(err);
  }
});
