import { randomUUID } from 'crypto';
import { PaymentSimulateResponse } from '@workshop/shared';
import { getDatabase } from '../database';

export async function simulatePayment(
  orderId: number,
  amount: number
): Promise<PaymentSimulateResponse> {
  // Simulate payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const db = getDatabase();
  db.prepare("UPDATE orders SET payment_status = 'paid' WHERE id = ?").run(orderId);

  // amount is validated by the caller; suppress unused-var warning
  void amount;

  return {
    success: true,
    transaction_id: 'TXN-' + randomUUID(),
    message: 'Payment processed successfully',
  };
}
