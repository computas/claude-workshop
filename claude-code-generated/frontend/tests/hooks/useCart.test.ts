import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { Cart } from '@workshop/shared';

// Mock the API module
vi.mock('../../src/api/cart.js', () => ({
  getCart: vi.fn(),
  addToCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeFromCart: vi.fn(),
}));

import * as cartApi from '../../src/api/cart.js';
import { useCart } from '../../src/hooks/useCart.js';

const SESSION = 'test-hook-session';

const emptyCart: Cart = { sessionId: SESSION, items: [], total: 0 };

const cartWithItem: Cart = {
  sessionId: SESSION,
  items: [{
    productId: 1,
    product: {
      id: 1, setNumber: '75192', name: 'Millennium Falcon', nameNo: 'Millennium Falcon',
      theme: 'Star Wars', pieces: 7541, price: 3000, description: 'Test', descriptionNo: 'Test',
      imageUrl: 'https://example.com/img.jpg', stock: 5, ageMin: 16,
    },
    quantity: 2,
  }],
  total: 6000,
};

// Mock localStorage
const localStorageMock = (() => {
  const store: Record<string, string> = { lego_session_id: SESSION };
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('useCart', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(cartApi.getCart).mockResolvedValue(emptyCart);
  });

  it('starts with empty cart', async () => {
    const { result } = renderHook(() => useCart());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.cart.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
  });

  it('fetches cart on mount', async () => {
    vi.mocked(cartApi.getCart).mockResolvedValue(cartWithItem);

    const { result } = renderHook(() => useCart());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(cartApi.getCart).toHaveBeenCalled();
    expect(result.current.cart.items.length).toBe(1);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.cart.total).toBe(6000);
  });

  it('addToCart updates cart state', async () => {
    vi.mocked(cartApi.addToCart).mockResolvedValue(cartWithItem);

    const { result } = renderHook(() => useCart());
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });

    await act(async () => {
      await result.current.addToCart(1, 2);
    });

    expect(cartApi.addToCart).toHaveBeenCalledWith(SESSION, 1, 2);
    expect(result.current.cart.items.length).toBe(1);
    expect(result.current.itemCount).toBe(2);
  });

  it('removeItem updates cart state', async () => {
    vi.mocked(cartApi.getCart).mockResolvedValue(cartWithItem);
    vi.mocked(cartApi.removeFromCart).mockResolvedValue(emptyCart);

    const { result } = renderHook(() => useCart());
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });

    await act(async () => {
      await result.current.removeItem(1);
    });

    expect(cartApi.removeFromCart).toHaveBeenCalledWith(SESSION, 1);
    expect(result.current.cart.items).toEqual([]);
  });

  it('updateQuantity calls API with correct args', async () => {
    const updatedCart: Cart = { ...cartWithItem, items: [{ ...cartWithItem.items[0], quantity: 5 }], total: 15000 };
    vi.mocked(cartApi.updateCartItem).mockResolvedValue(updatedCart);

    const { result } = renderHook(() => useCart());
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });

    await act(async () => {
      await result.current.updateQuantity(1, 5);
    });

    expect(cartApi.updateCartItem).toHaveBeenCalledWith(SESSION, 1, 5);
    expect(result.current.cart.items[0].quantity).toBe(5);
  });

  it('sets error when API call fails', async () => {
    vi.mocked(cartApi.addToCart).mockRejectedValue(new Error('Insufficient stock'));

    const { result } = renderHook(() => useCart());
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });

    await act(async () => {
      try {
        await result.current.addToCart(1, 100);
      } catch {
        // expected
      }
    });

    expect(result.current.error).toBe('Insufficient stock');
  });
});
