import type { Order, OrderWithItems, CreateOrderRequest } from '@workshop/shared';
import { apiFetch } from './client';

export function createOrder(data: CreateOrderRequest): Promise<Order> {
  return apiFetch<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function fetchOrderById(id: number): Promise<OrderWithItems> {
  return apiFetch<OrderWithItems>(`/orders/${id}`);
}
