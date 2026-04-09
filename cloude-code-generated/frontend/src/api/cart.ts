import type { Cart } from '@workshop/shared';
import { apiFetch } from './client.js';

export function getCart(sessionId: string): Promise<Cart> {
  return apiFetch<Cart>(`/cart/${sessionId}`);
}

export function addToCart(sessionId: string, productId: number, quantity: number): Promise<Cart> {
  return apiFetch<Cart>(`/cart/${sessionId}/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(sessionId: string, productId: number, quantity: number): Promise<Cart> {
  return apiFetch<Cart>(`/cart/${sessionId}/items/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
}

export function removeFromCart(sessionId: string, productId: number): Promise<Cart> {
  return apiFetch<Cart>(`/cart/${sessionId}/items/${productId}`, {
    method: 'DELETE',
  });
}
