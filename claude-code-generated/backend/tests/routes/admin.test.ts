import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import adminRouter from '../../src/routes/admin.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';
import { getDb } from '../../src/database/db.js';

getDb();

const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);
app.use(errorHandler);

describe('GET /api/admin/stats', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(200);
  });

  it('returns countByStatus with all order statuses', async () => {
    const res = await request(app).get('/api/admin/stats');
    const { countByStatus } = res.body as { countByStatus: Record<string, number> };
    const expected = ['received', 'confirmed', 'canceled', 'shipped', 'delivered', 'awaiting_return', 'returned'];
    for (const status of expected) {
      expect(countByStatus).toHaveProperty(status);
      expect(typeof countByStatus[status]).toBe('number');
    }
  });

  it('returns totalRevenue as a non-negative number', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(typeof res.body.totalRevenue).toBe('number');
    expect(res.body.totalRevenue).toBeGreaterThanOrEqual(0);
  });

  it('returns totalOrders as a non-negative integer', async () => {
    const res = await request(app).get('/api/admin/stats');
    expect(typeof res.body.totalOrders).toBe('number');
    expect(res.body.totalOrders).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(res.body.totalOrders)).toBe(true);
  });

  it('totalOrders matches sum of countByStatus values', async () => {
    const res = await request(app).get('/api/admin/stats');
    const { countByStatus, totalOrders } = res.body as { countByStatus: Record<string, number>; totalOrders: number };
    const sum = Object.values(countByStatus).reduce((a, b) => a + b, 0);
    expect(totalOrders).toBe(sum);
  });
});
