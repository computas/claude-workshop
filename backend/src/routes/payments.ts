import { Router, Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/paymentService';

export const router = Router();

// POST /api/payments/simulate
router.post('/simulate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order_id, amount } = req.body;

    if (order_id === undefined || amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields: order_id and amount' });
    }

    const result = await paymentService.simulatePayment(Number(order_id), Number(amount));
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});
