import { describe, it, expect, beforeEach } from 'vitest';
import { getAllProducts, getProductById, searchProducts, getThemes } from '../../src/services/productService.js';
import { getDb } from '../../src/database/db.js';

// Reset the DB module between tests
beforeEach(() => {
  // The in-memory DB is shared across tests in this file — we just query
});

describe('productService', () => {
  describe('getAllProducts', () => {
    it('returns 50 products', () => {
      const products = getAllProducts();
      expect(products.length).toBe(50);
    });

    it('returns products with required fields', () => {
      const products = getAllProducts();
      const product = products[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('theme');
      expect(product).toHaveProperty('setNumber');
      expect(product).toHaveProperty('imageUrl');
    });

    it('filters by theme', () => {
      const all = getAllProducts();
      const starWars = getAllProducts('Star Wars');
      expect(starWars.length).toBeGreaterThan(0);
      expect(starWars.length).toBeLessThan(all.length);
      starWars.forEach(p => expect(p.theme).toBe('Star Wars'));
    });

    it('returns empty array for unknown theme', () => {
      const products = getAllProducts('NonExistentTheme');
      expect(products).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('returns product by id', () => {
      const products = getAllProducts();
      const first = products[0];
      const found = getProductById(first.id);
      expect(found).not.toBeNull();
      expect(found!.id).toBe(first.id);
      expect(found!.name).toBe(first.name);
    });

    it('returns null for unknown id', () => {
      const result = getProductById(999999);
      expect(result).toBeNull();
    });
  });

  describe('searchProducts', () => {
    it('finds products by name', () => {
      const results = searchProducts('Falcon');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some(p => p.name.includes('Falcon'))).toBe(true);
    });

    it('finds products by theme', () => {
      const results = searchProducts('Technic');
      expect(results.length).toBeGreaterThan(0);
      results.forEach(p => expect(p.theme).toBe('Technic'));
    });

    it('returns empty array for no match', () => {
      const results = searchProducts('xyznonexistent123');
      expect(results).toEqual([]);
    });
  });

  describe('getThemes', () => {
    it('returns distinct themes', () => {
      const themes = getThemes();
      expect(themes.length).toBeGreaterThan(0);
      const unique = new Set(themes);
      expect(unique.size).toBe(themes.length);
    });

    it('includes Star Wars and Technic', () => {
      const themes = getThemes();
      expect(themes).toContain('Star Wars');
      expect(themes).toContain('Technic');
    });
  });

  describe('price range', () => {
    it('all products are priced between 100 and 3000 NOK', () => {
      const products = getAllProducts();
      products.forEach(p => {
        expect(p.price).toBeGreaterThanOrEqual(100);
        expect(p.price).toBeLessThanOrEqual(3000);
      });
    });
  });
});
