import type { PaymentResult } from '@workshop/shared';
import { randomUUID } from 'crypto';

export function chargePayment(token: string, amount: number): PaymentResult {
  // Mocked payment — always succeeds in this demo
  void token;
  void amount;
  return {
    success: true,
    transactionId: `txn_${randomUUID()}`,
    message: 'Payment processed successfully',
  };
}

export function refundPayment(transactionId: string): PaymentResult {
  // Mocked refund — always succeeds in this demo
  void transactionId;
  return {
    success: true,
    transactionId: `refund_${randomUUID()}`,
    message: 'Refund processed successfully',
  };
}
