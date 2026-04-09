// INTENTIONAL BUG (Exercise 2): port should be 3001, not 3002
const BASE_URL = 'http://localhost:3002/api';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((error as { error: string }).error ?? 'Request failed');
  }

  return response.json() as Promise<T>;
}
