import { describe, it, expect, beforeAll } from 'vitest';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../src/services/productService';

// Initialize DB once before all tests
beforeAll(() => {
  // Importing the service already triggers DB initialization via getDatabase()
});

describe('productService', () => {
  describe('getAllProducts', () => {
    it('returns an array of 50 products', () => {
      const products = getAllProducts({});
      expect(Array.isArray(products)).toBe(true);
      expect(products).toHaveLength(50);
    });

    it('filters by category', () => {
      const category = 'Festninger og borger';
      const products = getAllProducts({ category });
      expect(products.length).toBeGreaterThan(0);
      expect(products.every((p) => p.category === category)).toBe(true);
    });

    it('filters by minPrice', () => {
      const minPrice = 500;
      const products = getAllProducts({ minPrice });
      expect(products.every((p) => p.price >= minPrice)).toBe(true);
    });

    it('filters by maxPrice', () => {
      const maxPrice = 500;
      const products = getAllProducts({ maxPrice });
      expect(products.every((p) => p.price <= maxPrice)).toBe(true);
    });

    it('filters by minPrice and maxPrice range', () => {
      const minPrice = 300;
      const maxPrice = 800;
      const products = getAllProducts({ minPrice, maxPrice });
      expect(products.every((p) => p.price >= minPrice && p.price <= maxPrice)).toBe(true);
    });
  });

  describe('getProductById', () => {
    it('returns the product with id 1', () => {
      const product = getProductById(1);
      expect(product).not.toBeNull();
      expect(product?.id).toBe(1);
    });

    it('returns null for a non-existent id', () => {
      const product = getProductById(9999);
      expect(product).toBeNull();
    });
  });

  describe('createProduct', () => {
    it('creates and returns a product with an auto-incremented id', () => {
      const newProduct = {
        name: 'Testsettet',
        description: 'A test product',
        price: 999,
        category: 'Fabeldyr og drager' as const,
        image_url: null,
        stock: 10,
        piece_count: 100,
        age_min: 8,
      };

      const product = createProduct(newProduct);
      expect(product).not.toBeNull();
      expect(product.id).toBeGreaterThan(50); // seed data ends at 50
      expect(product.name).toBe(newProduct.name);
      expect(product.price).toBe(newProduct.price);
    });
  });

  describe('updateProduct', () => {
    it('updates a product and returns the updated version', () => {
      const updated = updateProduct(1, { price: 299 });
      expect(updated).not.toBeNull();
      expect(updated?.id).toBe(1);
      expect(updated?.price).toBe(299);
    });
  });

  describe('deleteProduct', () => {
    it('deletes a product and subsequent getById returns null', () => {
      // First create a product to delete so we don't disturb seed data
      const created = createProduct({
        name: 'Slett Meg',
        description: null,
        price: 123,
        category: 'Skog og naturmagi' as const,
        image_url: null,
        stock: 5,
        piece_count: null,
        age_min: null,
      });

      const deleted = deleteProduct(created.id);
      expect(deleted).toBe(true);

      const found = getProductById(created.id);
      expect(found).toBeNull();
    });
  });
});
