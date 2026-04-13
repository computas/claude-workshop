import { Router } from 'express';
import { chargePayment } from '../services/paymentService.js';

const router = Router();

router.post('/charge', (req, res, next) => {
  try {
    const { token, amount } = req.body as { token: string; amount: number };
    if (!token || !amount) {
      res.status(400).json({ error: 'token and amount are required' });
      return;
    }
    const result = chargePayment(token, amount);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
