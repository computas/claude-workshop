import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import productsRouter from '../../src/routes/products.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';
import { getDb } from '../../src/database/db.js';

// Initialize DB
getDb();

const app = express();
app.use(express.json());
app.use('/api/products', productsRouter);
app.use(errorHandler);

describe('GET /api/products', () => {
  it('returns 200 and a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(50);
  });

  it('returns products with the correct shape', async () => {
    const res = await request(app).get('/api/products');
    const product = res.body[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('theme');
    expect(product).toHaveProperty('imageUrl');
  });

  it('filters by theme', async () => {
    const res = await request(app).get('/api/products?theme=Technic');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((p: { theme: string }) => expect(p.theme).toBe('Technic'));
  });

  it('searches products by name', async () => {
    const res = await request(app).get('/api/products?search=Falcon');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/products/themes', () => {
  it('returns list of themes', async () => {
    const res = await request(app).get('/api/products/themes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('Star Wars');
    expect(res.body).toContain('Technic');
  });
});

describe('GET /api/products/:id', () => {
  it('returns product by id', async () => {
    const allRes = await request(app).get('/api/products');
    const firstId = allRes.body[0].id as number;

    const res = await request(app).get(`/api/products/${firstId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(firstId);
  });

  it('returns 404 for unknown product', async () => {
    const res = await request(app).get('/api/products/999999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
