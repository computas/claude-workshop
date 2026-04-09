import { describe, it, expect, beforeEach } from 'vitest';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../../src/services/cartService.js';
import { getAllProducts } from '../../src/services/productService.js';
import { getDb } from '../../src/database/db.js';

const SESSION = 'test-session-cart-001';

beforeEach(() => {
  // Clear cart before each test
  const db = getDb();
  db.prepare('DELETE FROM cart_items WHERE session_id = ?').run(SESSION);
});

describe('cartService', () => {
  describe('getCart', () => {
    it('returns empty cart for new session', () => {
      const cart = getCart(SESSION);
      expect(cart.sessionId).toBe(SESSION);
      expect(cart.items).toEqual([]);
      expect(cart.total).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('adds a product to the cart', () => {
      const products = getAllProducts();
      const product = products[0];

      const cart = addToCart(SESSION, product.id, 1);
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].productId).toBe(product.id);
      expect(cart.items[0].quantity).toBe(1);
    });

    it('calculates total correctly', () => {
      const products = getAllProducts();
      const product = products[0];

      const cart = addToCart(SESSION, product.id, 2);
      expect(cart.total).toBe(product.price * 2);
    });

    it('increases quantity when adding same product again', () => {
      const products = getAllProducts();
      const product = products[0];

      addToCart(SESSION, product.id, 1);
      const cart = addToCart(SESSION, product.id, 2);
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].quantity).toBe(3);
    });

    it('can add multiple different products', () => {
      const products = getAllProducts();

      addToCart(SESSION, products[0].id, 1);
      const cart = addToCart(SESSION, products[1].id, 1);
      expect(cart.items.length).toBe(2);
    });

    it('throws for unknown product', () => {
      expect(() => addToCart(SESSION, 999999, 1)).toThrow();
    });
  });

  describe('updateCartItem', () => {
    it('updates quantity', () => {
      const products = getAllProducts();
      addToCart(SESSION, products[0].id, 1);

      const cart = updateCartItem(SESSION, products[0].id, 5);
      expect(cart.items[0].quantity).toBe(5);
    });

    it('removes item when quantity is 0', () => {
      const products = getAllProducts();
      addToCart(SESSION, products[0].id, 3);

      const cart = updateCartItem(SESSION, products[0].id, 0);
      expect(cart.items.length).toBe(0);
    });

    it('removes item when quantity is negative', () => {
      const products = getAllProducts();
      addToCart(SESSION, products[0].id, 3);

      const cart = updateCartItem(SESSION, products[0].id, -1);
      expect(cart.items.length).toBe(0);
    });
  });

  describe('removeFromCart', () => {
    it('removes a specific item', () => {
      const products = getAllProducts();
      addToCart(SESSION, products[0].id, 1);
      addToCart(SESSION, products[1].id, 1);

      const cart = removeFromCart(SESSION, products[0].id);
      expect(cart.items.length).toBe(1);
      expect(cart.items[0].productId).toBe(products[1].id);
    });

    it('returns unchanged cart when product not in cart', () => {
      const products = getAllProducts();
      addToCart(SESSION, products[0].id, 1);

      const cart = removeFromCart(SESSION, products[1].id);
      expect(cart.items.length).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('empties the cart', () => {
      const products = getAllProducts();
      addToCart(SESSION, products[0].id, 2);
      addToCart(SESSION, products[1].id, 1);

      clearCart(SESSION);
      const cart = getCart(SESSION);
      expect(cart.items).toEqual([]);
      expect(cart.total).toBe(0);
    });
  });
});
