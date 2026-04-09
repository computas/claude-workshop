import express from 'express';
import db from '../db.js';
import { technicalLogger, businessLogger, orderLogger } from '../logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Valid status transitions
const validTransitions = {
  pending: ['confirmed', 'canceled'],
  confirmed: ['shipped', 'canceled'],
  shipped: ['delivered'],
  delivered: ['awaiting_return'],
  awaiting_return: ['returned'],
  canceled: [],
  returned: [],
};

function isValidTransition(fromStatus, toStatus) {
  return validTransitions[fromStatus]?.includes(toStatus) || false;
}

// GET /api/orders - List all orders with status filter
router.get('/', (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const orders = stmt.all(...params);

    res.json(orders);
  } catch (error) {
    technicalLogger.error('Error fetching orders', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get single order with items
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);

    res.json({
      ...order,
      items,
    });
  } catch (error) {
    technicalLogger.error('Error fetching order', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders - Create new order
router.post('/', (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_zip,
      shipping_country,
      invoice_address_line1,
      invoice_address_line2,
      invoice_city,
      invoice_zip,
      invoice_country,
      items,
    } = req.body;

    // Validation
    if (
      !customer_name ||
      !customer_email ||
      !shipping_address_line1 ||
      !shipping_city ||
      !shipping_zip ||
      !shipping_country ||
      !invoice_address_line1 ||
      !invoice_city ||
      !invoice_zip ||
      !invoice_country ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      if (!item.product_id || !item.quantity || item.unit_price === undefined) {
        return res.status(400).json({ error: 'Invalid order items' });
      }
      totalAmount += item.quantity * item.unit_price;
    }

    // Create order
    const insertOrder = db.prepare(
      `INSERT INTO orders (
        status, customer_name, customer_email,
        shipping_address_line1, shipping_address_line2, shipping_city, shipping_zip, shipping_country,
        invoice_address_line1, invoice_address_line2, invoice_city, invoice_zip, invoice_country,
        total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const orderResult = insertOrder.run(
      'pending',
      customer_name,
      customer_email,
      shipping_address_line1,
      shipping_address_line2 || null,
      shipping_city,
      shipping_zip,
      shipping_country,
      invoice_address_line1,
      invoice_address_line2 || null,
      invoice_city,
      invoice_zip,
      invoice_country,
      totalAmount
    );

    const orderId = orderResult.lastInsertRowid;

    // Create order items
    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
       VALUES (?, ?, ?, ?, ?)`
    );

    for (const item of items) {
      const product = db.prepare('SELECT name FROM products WHERE id = ?').get(item.product_id);
      insertItem.run(orderId, item.product_id, product.name, item.quantity, item.unit_price);
    }

    // Create payment record (will be processed separately)
    const paymentId = `PAY-${orderId}-${Date.now()}`;
    const insertPayment = db.prepare(
      `INSERT INTO payments (id, order_id, amount, status, payment_method)
       VALUES (?, ?, ?, ?, ?)`
    );

    insertPayment.run(paymentId, orderId, totalAmount, 'pending', null);

    // Update order with payment_id
    const updateOrder = db.prepare('UPDATE orders SET payment_id = ? WHERE id = ?');
    updateOrder.run(paymentId, orderId);

    // Log business event
    businessLogger.info('Order created', {
      orderId,
      customer_name,
      customer_email,
      totalAmount,
      itemCount: items.length,
    });

    // Log to order-specific log
    const oLogger = orderLogger(orderId);
    oLogger.info('Order created', {
      orderId,
      customer_name,
      totalAmount,
      itemCount: items.length,
      status: 'pending',
    });

    // Fetch and return complete order
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    res.status(201).json({
      ...order,
      items: orderItems,
    });
  } catch (error) {
    technicalLogger.error('Error creating order', { error: error.message });
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Validate transition
    if (!isValidTransition(order.status, newStatus)) {
      return res.status(400).json({
        error: `Cannot transition from ${order.status} to ${newStatus}`,
      });
    }

    // Update order status
    const updateOrder = db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    updateOrder.run(newStatus, id);

    // Log business event
    businessLogger.info('Order status changed', {
      orderId: id,
      fromStatus: order.status,
      toStatus: newStatus,
      customer_email: order.customer_email,
    });

    // Log to order-specific log
    const oLogger = orderLogger(id);
    oLogger.info('Status changed', {
      fromStatus: order.status,
      toStatus: newStatus,
    });

    const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    res.json(updatedOrder);
  } catch (error) {
    technicalLogger.error('Error updating order status', { error: error.message });
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// POST /api/orders/:id/refund - Refund payment
router.post('/:id/refund', (req, res) => {
  try {
    const { id } = req.params;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Can only refund canceled or returned orders
    if (order.status !== 'canceled' && order.status !== 'returned') {
      return res.status(400).json({
        error: `Cannot refund order with status ${order.status}. Order must be canceled or returned.`,
      });
    }

    // Update payment status
    const updatePayment = db.prepare('UPDATE payments SET status = ? WHERE order_id = ?');
    updatePayment.run('refunded', id);

    // Log business event
    businessLogger.info('Refund processed', {
      orderId: id,
      amount: order.total_amount,
      customer_email: order.customer_email,
      orderStatus: order.status,
    });

    // Log to order-specific log
    const oLogger = orderLogger(id);
    oLogger.info('Refund processed', {
      amount: order.total_amount,
      previousOrderStatus: order.status,
    });

    const updatedPayment = db.prepare('SELECT * FROM payments WHERE order_id = ?').get(id);

    res.json({
      message: 'Refund processed successfully',
      payment: updatedPayment,
    });
  } catch (error) {
    technicalLogger.error('Error processing refund', { error: error.message });
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// GET /api/orders/:id/logs - Get order-specific logs
router.get('/:id/logs', (req, res) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const logsDir = path.join(__dirname, '..', 'logs', 'orders');
    const logFile = path.join(logsDir, `${id}.log`);

    if (!fs.existsSync(logFile)) {
      return res.json({ orderId: id, logs: [] });
    }

    const content = fs.readFileSync(logFile, 'utf8');
    const logs = content
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return { message: line };
        }
      });

    res.json({ orderId: id, logs });
  } catch (error) {
    technicalLogger.error('Error fetching order logs', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch order logs' });
  }
});

export default router;
