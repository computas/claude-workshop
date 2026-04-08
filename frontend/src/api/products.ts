import type { Product, ProductFilters } from '@workshop/shared';
import { apiFetch } from './client';

export function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  const query = params.toString();
  return apiFetch<Product[]>(`/products${query ? `?${query}` : ''}`);
}

export function fetchProductById(id: number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`);
}

export function createProduct(
  data: Omit<Product, 'id' | 'created_at'>,
): Promise<Product> {
  return apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProduct(
  id: number,
  data: Partial<Omit<Product, 'id' | 'created_at'>>,
): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: number): Promise<void> {
  return apiFetch<void>(`/products/${id}`, { method: 'DELETE' });
}
