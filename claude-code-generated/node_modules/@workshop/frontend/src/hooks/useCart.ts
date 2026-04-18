import { useState, useEffect, useCallback } from 'react';
import type { Cart } from '@workshop/shared';
import * as cartApi from '../api/cart.js';

const SESSION_KEY = 'lego_session_id';

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const emptyCart: Cart = { sessionId: '', items: [], total: 0 };

export function useCart() {
  const sessionId = getSessionId();
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartApi.getCart(sessionId);
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  async function addToCart(productId: number, quantity = 1) {
    setError(null);
    try {
      const data = await cartApi.addToCart(sessionId, productId, quantity);
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    }
  }

  async function updateQuantity(productId: number, quantity: number) {
    setError(null);
    try {
      const data = await cartApi.updateCartItem(sessionId, productId, quantity);
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quantity');
    }
  }

  async function removeItem(productId: number) {
    setError(null);
    try {
      const data = await cartApi.removeFromCart(sessionId, productId);
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    }
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    sessionId,
    loading,
    error,
    itemCount,
    addToCart,
    updateQuantity,
    removeItem,
    refresh: fetchCart,
  };
}
