import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { CartProvider, useCart } from '../../src/hooks/useCart';
import type { Product } from '@workshop/shared';

const mockProduct: Product = {
  id: 1,
  name: 'Havslottet',
  description: null,
  price: 799,
  category: 'Hav og undervannsverdener',
  image_url: null,
  stock: 5,
  piece_count: 412,
  age_min: 8,
  created_at: '2024-01-01T00:00:00.000Z',
};

const mockProduct2: Product = {
  id: 2,
  name: 'Skogstårnet',
  description: null,
  price: 499,
  category: 'Skog og naturmagi',
  image_url: null,
  stock: 3,
  piece_count: 250,
  age_min: 7,
  created_at: '2024-01-01T00:00:00.000Z',
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(CartProvider, null, children);

describe('useCart', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: vi.fn((key: string) => { delete store[key]; }),
      clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
      length: 0,
      key: vi.fn(() => null),
    });
  });

  it('initial state: items is empty array, total is 0, itemCount is 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('addItem adds product to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product).toEqual(mockProduct);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('addItem same product twice increments quantity (not adds duplicate)', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('removeItem removes product from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct2);
    });
    act(() => {
      result.current.removeItem(mockProduct.id);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(mockProduct2.id);
  });

  it('updateQuantity changes quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
    });
    act(() => {
      result.current.updateQuantity(mockProduct.id, 5);
    });
    expect(result.current.items[0].quantity).toBe(5);
  });

  it('updateQuantity to 0 removes item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
    });
    act(() => {
      result.current.updateQuantity(mockProduct.id, 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('clearCart empties the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct2);
    });
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct2);
    });
    // 799 * 2 + 499 * 1 = 2097
    expect(result.current.total).toBe(2097);
  });

  it('cart is persisted to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(mockProduct);
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workshop-cart',
      expect.any(String),
    );
  });
});
