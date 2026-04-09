import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { initializeDatabase } from '../db.js';

describe('Orders API', () => {
  let app;

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(() => {
    app = createApp();
  });

  const validOrderPayload = {
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    shipping_address_line1: '123 Main St',
    shipping_city: 'Oslo',
    shipping_zip: '0150',
    shipping_country: 'Norway',
    invoice_address_line1: '123 Main St',
    invoice_city: 'Oslo',
    invoice_zip: '0150',
    invoice_country: 'Norway',
    items: [
      {
        product_id: 1,
        quantity: 2,
        unit_price: 899,
      },
      {
        product_id: 2,
        quantity: 1,
        unit_price: 1299,
      },
    ],
  };

  describe('POST /api/orders', () => {
    it('should create a new order with items', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.customer_name).toBe('John Doe');
      expect(response.body.customer_email).toBe('john@example.com');
      expect(response.body.status).toBe('pending');
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBe(2);
      expect(response.body.total_amount).toBe(3097); // 2*899 + 1*1299 = 1798 + 1299
    });

    it('should create a payment record for the order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      expect(response.body).toHaveProperty('payment_id');
      expect(response.body.payment_id).toBeDefined();
    });

    it('should return 400 if required fields are missing', async () => {
      const incompletePayload = {
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        // Missing shipping and invoice addresses
        items: [{ product_id: 1, quantity: 1, unit_price: 899 }],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(incompletePayload)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Missing required fields');
    });

    it('should return 400 if items array is empty', async () => {
      const payloadWithoutItems = {
        ...validOrderPayload,
        items: [],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(payloadWithoutItems)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should calculate total amount correctly', async () => {
      const payload = {
        ...validOrderPayload,
        items: [
          { product_id: 1, quantity: 3, unit_price: 100 },
          { product_id: 2, quantity: 2, unit_price: 250 },
        ],
      };

      const response = await request(app)
        .post('/api/orders')
        .send(payload)
        .expect(201);

      const expectedTotal = 3 * 100 + 2 * 250; // 800
      expect(response.body.total_amount).toBe(expectedTotal);
    });

    it('should include order items with product names', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      expect(response.body.items[0]).toHaveProperty('product_name');
      expect(response.body.items[0].product_name).toBeDefined();
      expect(response.body.items[0]).toHaveProperty('quantity');
      expect(response.body.items[0]).toHaveProperty('unit_price');
    });
  });

  describe('GET /api/orders', () => {
    it('should list all orders', async () => {
      // Create a couple of orders first
      await request(app)
        .post('/api/orders')
        .send(validOrderPayload);

      await request(app)
        .post('/api/orders')
        .send(validOrderPayload);

      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter orders by status', async () => {
      // Create a pending order
      const pendingPayload = {
        ...validOrderPayload,
        customer_email: 'pending@example.com',
      };

      await request(app)
        .post('/api/orders')
        .send(pendingPayload);

      const response = await request(app)
        .get('/api/orders?status=pending')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      response.body.forEach(order => {
        expect(order.status).toBe('pending');
      });
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return order with items', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(orderId);
      expect(response.body).toHaveProperty('items');
      expect(response.body.items).toBeInstanceOf(Array);
      expect(response.body.items.length).toBe(2);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    it('should update order status from pending to confirmed', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'confirmed' })
        .expect(200);

      expect(response.body.status).toBe('confirmed');
    });

    it('should update order status from confirmed to shipped', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      // First move to confirmed
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'confirmed' })
        .expect(200);

      // Then to shipped
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'shipped' })
        .expect(200);

      expect(response.body.status).toBe('shipped');
    });

    it('should reject invalid status transition (pending to shipped)', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'shipped' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot transition');
    });

    it('should allow cancellation from pending status', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'canceled' })
        .expect(200);

      expect(response.body.status).toBe('canceled');
    });

    it('should allow cancellation from confirmed status', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      // Move to confirmed
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'confirmed' })
        .expect(200);

      // Then cancel
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'canceled' })
        .expect(200);

      expect(response.body.status).toBe('canceled');
    });

    it('should reject cancellation from shipped status', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      // Move through valid transitions to shipped
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'confirmed' })
        .expect(200);

      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'shipped' })
        .expect(200);

      // Try to cancel (should fail)
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'canceled' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot transition');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .put('/api/orders/99999/status')
        .send({ status: 'confirmed' })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });

    it('should return 400 if status is missing', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/orders/:id/refund', () => {
    it('should refund a canceled order', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      // Cancel the order
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'canceled' })
        .expect(200);

      // Refund it
      const response = await request(app)
        .post(`/api/orders/${orderId}/refund`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Refund processed successfully');
      expect(response.body.payment).toHaveProperty('status');
      expect(response.body.payment.status).toBe('refunded');
    });

    it('should refund a returned order', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      // Move order through valid transitions to returned
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'confirmed' });

      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'shipped' });

      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'delivered' });

      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'awaiting_return' });

      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'returned' });

      // Refund it
      const response = await request(app)
        .post(`/api/orders/${orderId}/refund`)
        .expect(200);

      expect(response.body.payment.status).toBe('refunded');
    });

    it('should reject refund for pending orders', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      const response = await request(app)
        .post(`/api/orders/${orderId}/refund`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot refund');
    });

    it('should reject refund for confirmed orders', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      // Confirm the order
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'confirmed' })
        .expect(200);

      // Try to refund (should fail)
      const response = await request(app)
        .post(`/api/orders/${orderId}/refund`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot refund');
    });

    it('should reject refund for shipped orders', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = createResponse.body.id;

      // Move to shipped
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'confirmed' });

      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({ status: 'shipped' });

      // Try to refund (should fail)
      const response = await request(app)
        .post(`/api/orders/${orderId}/refund`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .post('/api/orders/99999/refund')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });
  });
});
