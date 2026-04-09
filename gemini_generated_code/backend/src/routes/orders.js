const express = require('express');
const { getDb } = require('../utils/db');
const { technicalLogger, businessLogger } = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// POST /orders - Create a new order
router.post('/', (req, res) => {
  const db = getDb();
  const { customerName, customerEmail, shippingAddress, billingAddress, items } = req.body;

  if (!customerName || !customerEmail || !shippingAddress || !billingAddress || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required order data' });
  }

  const orderId = uuidv4();
  const orderDate = new Date().toISOString();
  const status = 'received';

  // Calculate total amount and prepare order items
  let totalAmount = 0;
  const orderItems = [];

  const productIds = items.map(item => item.productId);
  const placeholders = productIds.map(() => '?').join(',');

  db.all(`SELECT * FROM products WHERE id IN (${placeholders})`, productIds, (err, products) => {
    if (err) {
      technicalLogger.error('Error fetching products for order:', err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (products.length !== productIds.length) {
      return res.status(400).json({ error: 'One or more products not found' });
    }

    const productMap = products.reduce((map, p) => {
      map[p.id] = p;
      return map;
    }, {});

    for (const item of items) {
      const product = productMap[item.productId];
      if (!product) {
        return res.status(400).json({ error: `Product with id ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        ...item,
        productName: product.name,
        price: product.price
      });
    }

    // Insert order and order items in a transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      const insertOrder = db.prepare('INSERT INTO orders (id, customerName, customerEmail, shippingAddress, billingAddress, totalAmount, status, orderDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      insertOrder.run(orderId, customerName, customerEmail, shippingAddress, billingAddress, totalAmount, status, orderDate, function(err) {
        if (err) {
          db.run('ROLLBACK');
          technicalLogger.error('Error creating order:', err.message);
          return res.status(500).json({ error: 'Internal server error' });
        }

        const insertItem = db.prepare('INSERT INTO order_items (orderId, productId, productName, quantity, price) VALUES (?, ?, ?, ?, ?)');
        for (const item of orderItems) {
          insertItem.run(orderId, item.productId, item.productName, item.quantity, item.price);
        }
        insertItem.finalize();

        const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
        for (const item of items) {
          updateStock.run(item.quantity, item.productId);
        }
        updateStock.finalize();

        db.run('COMMIT', (err) => {
          if (err) {
            technicalLogger.error('Error committing transaction:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
          }
          businessLogger.info(`Order ${orderId} created successfully.`);
          res.status(201).json({ orderId, status: 'success' });
        });
      });
    });
  });
});

// GET /orders/:id - Get order by ID
router.get('/:id', (req, res) => {
  const db = getDb();
  const { id } = req.params;

  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, order) => {
    if (err) {
      technicalLogger.error(`Error fetching order ${id}:`, err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    db.all('SELECT * FROM order_items WHERE orderId = ?', [id], (err, items) => {
      if (err) {
        technicalLogger.error(`Error fetching order items for order ${id}:`, err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      order.items = items;
      res.json(order);
    });
  });
});

// PATCH /orders/:id/status - Update order status
router.patch('/:id/status', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ['received', 'confirmed', 'shipped', 'delivered', 'canceled', 'awaiting_return', 'returned'];
  if (!status || !allowedStatus.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      technicalLogger.error(`Error updating status for order ${id}:`, err.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    businessLogger.info(`Order ${id} status updated to ${status}.`);
    res.json({ message: 'Order status updated successfully' });
  });
});

module.exports = router;
