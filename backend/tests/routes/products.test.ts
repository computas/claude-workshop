import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/index';

describe('GET /api/products', () => {
  it('returns 200 with an array of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns only products matching the given category', async () => {
    const category = 'Festninger og borger';
    const res = await request(app).get(`/api/products?category=${encodeURIComponent(category)}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((p: { category: string }) => p.category === category)).toBe(true);
  });
});

describe('GET /api/products/:id', () => {
  it('returns 200 with the product for a valid id', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('returns 404 for a non-existent product id', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/products', () => {
  it('creates a product and returns 201', async () => {
    const newProduct = {
      name: 'API Testprodukt',
      description: 'Created via API test',
      price: 450,
      category: 'Romfart og galakser',
      image_url: null,
      stock: 20,
      piece_count: 200,
      age_min: 9,
    };

    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeGreaterThan(0);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.price).toBe(newProduct.price);
  });
});

describe('PUT /api/products/:id', () => {
  it('updates a product and returns the updated product', async () => {
    const res = await request(app).put('/api/products/2').send({ price: 450 });
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(2);
    expect(res.body.price).toBe(450);
  });
});

describe('DELETE /api/products/:id', () => {
  it('deletes a product and returns 204', async () => {
    // First create a product to delete
    const createRes = await request(app).post('/api/products').send({
      name: 'Skal Slettes',
      description: null,
      price: 100,
      category: 'Skog og naturmagi',
      image_url: null,
      stock: 1,
      piece_count: null,
      age_min: null,
    });
    expect(createRes.status).toBe(201);
    const id = createRes.body.id;

    const deleteRes = await request(app).delete(`/api/products/${id}`);
    expect(deleteRes.status).toBe(204);

    // Verify it's gone
    const getRes = await request(app).get(`/api/products/${id}`);
    expect(getRes.status).toBe(404);
  });
});
