import type { Order, OrderStats, OrderStatus, CheckoutPayload } from '@workshop/shared';
import { apiFetch } from './client.js';

export function createOrder(payload: CheckoutPayload): Promise<Order> {
  return apiFetch<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getOrder(id: number): Promise<Order> {
  return apiFetch<Order>(`/orders/${id}`);
}

export function getAdminOrders(status?: OrderStatus): Promise<Order[]> {
  const params = status ? `?status=${status}` : '';
  return apiFetch<Order[]>(`/admin/orders${params}`);
}

export function updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
  return apiFetch<Order>(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function refundOrder(orderId: number): Promise<Order> {
  return apiFetch<Order>(`/admin/orders/${orderId}/refund`, {
    method: 'POST',
  });
}

export interface OrderLogs {
  orderLogs: object[];
  technicalLogs?: object[];
}

export function getOrderLogs(orderId: number, includeTechnical = false): Promise<OrderLogs> {
  return apiFetch<OrderLogs>(`/admin/logs/${orderId}?includeTechnical=${includeTechnical}`);
}

export function openLogsDirectory(): Promise<{ success: boolean; path: string }> {
  return apiFetch('/admin/logs/open-directory', { method: 'POST' });
}

export function getAdminStats(): Promise<OrderStats> {
  return apiFetch<OrderStats>('/admin/stats');
}
