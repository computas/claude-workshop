import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { initializeDatabase } from '../db.js';
import db from '../db.js';

describe('Products API', () => {
  let app;

  beforeAll(async () => {
    // Initialize database once for all tests
    await initializeDatabase();
  });

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /api/products', () => {
    it('should return all 50 products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(50);
    });

    it('should return products with correct structure', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      const product = response.body[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('category');
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=City')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(5);
      response.body.forEach(product => {
        expect(product.category).toBe('City');
      });
    });

    it('should filter products by search term', async () => {
      const response = await request(app)
        .get('/api/products?search=Ferrari')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      const ferrariProduct = response.body.find(p => p.name.includes('Ferrari'));
      expect(ferrariProduct).toBeDefined();
      expect(ferrariProduct.category).toBe('Speed Champions');
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products?minPrice=2000&maxPrice=3000')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
      response.body.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(2000);
        expect(product.price).toBeLessThanOrEqual(3000);
      });
    });

    it('should support multiple filters together', async () => {
      const response = await request(app)
        .get('/api/products?category=Technic&minPrice=1000&maxPrice=2000')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach(product => {
        expect(product.category).toBe('Technic');
        expect(product.price).toBeGreaterThanOrEqual(1000);
        expect(product.price).toBeLessThanOrEqual(2000);
      });
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product by ID', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(1);
      expect(response.body).toHaveProperty('name');
      expect(response.body.name).toBe('LEGO City Police Station');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });

    it('should return correct product data', async () => {
      const response = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(response.body.price).toBe(899);
      expect(response.body.category).toBe('City');
      expect(response.body.age_range).toBe('6+');
      expect(response.body.piece_count).toBe(743);
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'Test LEGO Set',
        description: 'A test product',
        price: 599,
        category: 'Test',
        age_range: '12+',
        piece_count: 500,
        in_stock: true,
      };

      const response = await request(app)
        .post('/api/products')
        .send(newProduct)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test LEGO Set');
      expect(response.body.price).toBe(599);
      expect(response.body.category).toBe('Test');
    });

    it('should return 400 if name is missing', async () => {
      const incompleteProduct = {
        price: 599,
        category: 'Test',
      };

      const response = await request(app)
        .post('/api/products')
        .send(incompleteProduct)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 if price is missing', async () => {
      const incompleteProduct = {
        name: 'Test Product',
        category: 'Test',
      };

      const response = await request(app)
        .post('/api/products')
        .send(incompleteProduct)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should create product with only required fields', async () => {
      const minimalProduct = {
        name: 'Minimal Product',
        price: 399,
      };

      const response = await request(app)
        .post('/api/products')
        .send(minimalProduct)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe('Minimal Product');
      expect(response.body.price).toBe(399);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const updates = {
        name: 'Updated Police Station',
        price: 799,
      };

      const response = await request(app)
        .put('/api/products/1')
        .send(updates)
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Updated Police Station');
      expect(response.body.price).toBe(799);
    });

    it('should return 404 for non-existent product', async () => {
      const updates = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put('/api/products/999')
        .send(updates)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });

    it('should update only specified fields', async () => {
      // First get the original product to know its price
      const originalProduct = await request(app)
        .get('/api/products/2')
        .expect(200);

      const originalPrice = originalProduct.body.price;

      const updates = {
        name: 'New Name Only',
      };

      const response = await request(app)
        .put('/api/products/2')
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe('New Name Only');
      // Original price should remain
      expect(response.body.price).toBe(originalPrice);
    });

    it('should update all fields when provided', async () => {
      const updates = {
        name: 'Fully Updated',
        description: 'New description',
        price: 1299,
        category: 'Updated',
        age_range: '18+',
        piece_count: 2000,
        in_stock: false,
      };

      const response = await request(app)
        .put('/api/products/1')
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe('Fully Updated');
      expect(response.body.description).toBe('New description');
      expect(response.body.price).toBe(1299);
      expect(response.body.category).toBe('Updated');
      expect(response.body.age_range).toBe('18+');
      expect(response.body.piece_count).toBe(2000);
      expect(response.body.in_stock).toBe(0); // false converts to 0
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const response = await request(app)
        .delete('/api/products/50')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Product deleted successfully');
      expect(response.body.product).toBeDefined();
    });

    it('should return 404 when deleting non-existent product', async () => {
      const response = await request(app)
        .delete('/api/products/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });

    it('should actually remove the product from database', async () => {
      // First delete a product
      await request(app)
        .delete('/api/products/49')
        .expect(200);

      // Then try to fetch it
      const response = await request(app)
        .get('/api/products/49')
        .expect(404);

      expect(response.body.error).toBe('Product not found');
    });
  });
});
