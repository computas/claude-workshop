import { Router } from 'express';
import { createOrder, getOrderById } from '../services/orderService.js';
import type { CheckoutPayload } from '@workshop/shared';

const router = Router();

router.post('/', (req, res, next) => {
  try {
    const payload = req.body as CheckoutPayload;
    if (!payload.sessionId || !payload.shippingAddress || !payload.billingAddress) {
      res.status(400).json({ error: 'sessionId, shippingAddress, and billingAddress are required' });
      return;
    }
    const billing = payload.sameAsBilling ? payload.shippingAddress : payload.billingAddress;
    const order = createOrder(payload.sessionId, payload.shippingAddress, billing, payload.paymentToken);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const order = getOrderById(parseInt(req.params.id, 10));
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

export default router;
