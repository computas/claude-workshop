// INTENTIONAL BUG (Exercise 2): wrong port — should be 3001
const BASE_URL = 'http://localhost:3002/api';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error((errorBody as { error?: string }).error ?? `HTTP error ${response.status}`);
  }
  return response.json() as Promise<T>;
}
