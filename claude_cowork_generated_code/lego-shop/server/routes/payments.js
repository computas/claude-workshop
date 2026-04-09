import express from 'express';
import db from '../db.js';
import { technicalLogger, businessLogger, orderLogger } from '../logger.js';

const router = express.Router();

// POST /api/payments/process - Simulated payment processing
// This is a mock endpoint: it always succeeds after a short delay.
// In a real application this would integrate with Stripe, Vipps, etc.
router.post('/process', async (req, res) => {
  try {
    const { amount, payment_method } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'amount is required' });
    }

    // Simulate a short processing delay (like a real payment gateway)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate a mock payment token
    const paymentToken = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    businessLogger.info('Payment processed (simulated)', {
      paymentToken,
      amount,
      payment_method: payment_method || 'credit_card',
      status: 'completed',
    });

    res.json({
      success: true,
      payment_id: paymentToken,
      amount,
      status: 'completed',
      message: 'Payment processed successfully (simulated)',
    });
  } catch (error) {
    technicalLogger.error('Error processing payment', { error: error.message });
    res.status(500).json({ success: false, error: 'Failed to process payment' });
  }
});

// POST /api/payments/:id/refund - Simulated refund
router.post('/:id/refund', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if payment exists
    const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check if payment is already refunded
    if (payment.status === 'refunded') {
      return res.status(400).json({ error: 'Payment already refunded' });
    }

    // Simulate refund processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update payment status
    db.prepare('UPDATE payments SET status = ? WHERE id = ?').run('refunded', id);

    // Log business event
    businessLogger.info('Payment refunded', {
      paymentId: id,
      orderId: payment.order_id,
      amount: payment.amount,
      status: 'refunded',
    });

    // Log to order-specific log
    const oLogger = orderLogger(payment.order_id);
    oLogger.info('Payment refunded', {
      paymentId: id,
      amount: payment.amount,
    });

    res.json({
      success: true,
      payment_id: id,
      order_id: payment.order_id,
      amount: payment.amount,
      status: 'refunded',
      message: 'Refund processed successfully (simulated)',
    });
  } catch (error) {
    technicalLogger.error('Error processing refund', { error: error.message });
    res.status(500).json({ success: false, error: 'Failed to process refund' });
  }
});

export default router;
