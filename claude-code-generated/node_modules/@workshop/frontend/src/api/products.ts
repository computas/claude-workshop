import type { Product } from '@workshop/shared';
import { apiFetch } from './client.js';

export function getProducts(theme?: string): Promise<Product[]> {
  const params = theme ? `?theme=${encodeURIComponent(theme)}` : '';
  return apiFetch<Product[]>(`/products${params}`);
}

export function getProduct(id: number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export function searchProducts(query: string): Promise<Product[]> {
  return apiFetch<Product[]>(`/products?search=${encodeURIComponent(query)}`);
}

export function getThemes(): Promise<string[]> {
  return apiFetch<string[]>('/products/themes');
}
