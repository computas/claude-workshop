import type { PaymentSimulateResponse } from '@workshop/shared';
import { apiFetch } from './client';

export function simulatePayment(
  orderId: number,
  amount: number,
): Promise<PaymentSimulateResponse> {
  return apiFetch<PaymentSimulateResponse>('/payments/simulate', {
    method: 'POST',
    body: JSON.stringify({ order_id: orderId, amount }),
  });
}
