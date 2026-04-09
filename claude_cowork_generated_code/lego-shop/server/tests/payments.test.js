import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { initializeDatabase } from '../db.js';
import db from '../db.js';

describe('Payments API', () => {
  let app;

  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(() => {
    app = createApp();
  });

  const validOrderPayload = {
    customer_name: 'Jane Doe',
    customer_email: 'jane@example.com',
    shipping_address_line1: '456 Oak Ave',
    shipping_city: 'Bergen',
    shipping_zip: '5012',
    shipping_country: 'Norway',
    invoice_address_line1: '456 Oak Ave',
    invoice_city: 'Bergen',
    invoice_zip: '5012',
    invoice_country: 'Norway',
    items: [
      {
        product_id: 1,
        quantity: 1,
        unit_price: 899,
      },
    ],
  };

  describe('POST /api/payments/process', () => {
    it('should process a payment for an order', async () => {
      // First create an order
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = orderResponse.body.id;
      const amount = orderResponse.body.total_amount;

      // Process payment
      const response = await request(app)
        .post('/api/payments/process')
        .send({
          order_id: orderId,
          amount,
          payment_method: 'credit_card',
        })
        .expect(200);

      expect(response.body).toHaveProperty('payment_id');
      expect(response.body.order_id).toBe(orderId);
      expect(response.body.amount).toBe(amount);
      expect(response.body.status).toBe('processing');
    });

    it('should accept payment without payment_method', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = orderResponse.body.id;
      const amount = orderResponse.body.total_amount;

      const response = await request(app)
        .post('/api/payments/process')
        .send({
          order_id: orderId,
          amount,
        })
        .expect(200);

      expect(response.body.status).toBe('processing');
    });

    it('should return 400 if order_id is missing', async () => {
      const response = await request(app)
        .post('/api/payments/process')
        .send({
          amount: 899,
          payment_method: 'credit_card',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('order_id and amount are required');
    });

    it('should return 400 if amount is missing', async () => {
      const response = await request(app)
        .post('/api/payments/process')
        .send({
          order_id: 1,
          payment_method: 'credit_card',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('order_id and amount are required');
    });

    it('should return 404 if order does not exist', async () => {
      const response = await request(app)
        .post('/api/payments/process')
        .send({
          order_id: 99999,
          amount: 899,
          payment_method: 'credit_card',
        })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });

    it('should eventually update payment status to completed', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = orderResponse.body.id;
      const amount = orderResponse.body.total_amount;
      const paymentId = orderResponse.body.payment_id;

      // Process payment
      await request(app)
        .post('/api/payments/process')
        .send({
          order_id: orderId,
          amount,
          payment_method: 'credit_card',
        })
        .expect(200);

      // Wait for async processing (500ms in the route + buffer)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check that payment status has been updated
      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
      expect(payment.status).toBe('completed');
    });

    it('should support different payment methods', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = orderResponse.body.id;
      const amount = orderResponse.body.total_amount;

      const paymentMethods = ['credit_card', 'paypal', 'bank_transfer'];

      for (const method of paymentMethods) {
        const response = await request(app)
          .post('/api/payments/process')
          .send({
            order_id: orderId,
            amount,
            payment_method: method,
          })
          .expect(200);

        expect(response.body).toHaveProperty('payment_id');
      }
    });
  });

  describe('POST /api/payments/:id/refund', () => {
    it('should process a refund for a payment', async () => {
      // Create order and get payment ID
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const paymentId = orderResponse.body.payment_id;

      // Process the payment first
      await request(app)
        .post('/api/payments/process')
        .send({
          order_id: orderResponse.body.id,
          amount: orderResponse.body.total_amount,
          payment_method: 'credit_card',
        })
        .expect(200);

      // Wait for async completion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refund the payment
      const response = await request(app)
        .post(`/api/payments/${paymentId}/refund`)
        .expect(200);

      expect(response.body).toHaveProperty('payment_id');
      expect(response.body.payment_id).toBe(paymentId);
      expect(response.body.status).toBe('refunding');
    });

    it('should return 404 if payment does not exist', async () => {
      const response = await request(app)
        .post('/api/payments/99999/refund')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Payment not found');
    });

    it('should reject refund if payment already refunded', async () => {
      // Create order
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const paymentId = orderResponse.body.payment_id;

      // Process and refund
      await request(app)
        .post('/api/payments/process')
        .send({
          order_id: orderResponse.body.id,
          amount: orderResponse.body.total_amount,
        })
        .expect(200);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // First refund should succeed
      await request(app)
        .post(`/api/payments/${paymentId}/refund`)
        .expect(200);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Second refund should fail
      const response = await request(app)
        .post(`/api/payments/${paymentId}/refund`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Payment already refunded');
    });

    it('should eventually update payment status to refunded', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const paymentId = orderResponse.body.payment_id;

      // Process payment
      await request(app)
        .post('/api/payments/process')
        .send({
          order_id: orderResponse.body.id,
          amount: orderResponse.body.total_amount,
        })
        .expect(200);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refund payment
      await request(app)
        .post(`/api/payments/${paymentId}/refund`)
        .expect(200);

      // Wait for async processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check that payment status is refunded
      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
      expect(payment.status).toBe('refunded');
    });

    it('should track refund for the correct order', async () => {
      const orderResponse = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = orderResponse.body.id;
      const paymentId = orderResponse.body.payment_id;

      // Process and refund
      await request(app)
        .post('/api/payments/process')
        .send({
          order_id: orderId,
          amount: orderResponse.body.total_amount,
        })
        .expect(200);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const refundResponse = await request(app)
        .post(`/api/payments/${paymentId}/refund`)
        .expect(200);

      expect(refundResponse.body.order_id).toBe(orderId);
      expect(refundResponse.body.amount).toBe(orderResponse.body.total_amount);
    });
  });

  describe('Payment integration with orders', () => {
    it('should create payment record when order is created', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = response.body.id;
      const paymentId = response.body.payment_id;

      expect(paymentId).toBeDefined();

      // Verify payment exists
      const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(paymentId);
      expect(payment).toBeDefined();
      expect(payment.order_id).toBe(orderId);
      expect(payment.amount).toBe(response.body.total_amount);
      expect(payment.status).toBe('pending');
    });

    it('should link order to payment via payment_id', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send(validOrderPayload)
        .expect(201);

      const orderId = response.body.id;
      const paymentId = response.body.payment_id;

      // Verify order has payment_id
      const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
      expect(order.payment_id).toBe(paymentId);
    });
  });
});
