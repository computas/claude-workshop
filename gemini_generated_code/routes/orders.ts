import { Router } from "express";
import { db } from "../db/index.js";
import { setupLogger } from "../logger.js";

const router = Router();
const { businessLogger } = setupLogger();

router.get("/", (req, res) => {
  const { status } = req.query;
  let query = "SELECT * FROM orders";
  const params: any[] = [];

  if (status) {
    query += " WHERE status = ?";
    params.push(status);
  }
  query += " ORDER BY created_at DESC";

  const orders = db.prepare(query).all(...params) as any[];
  res.json(orders);
});

router.get("/:id", (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
  if (!order) return res.status(404).json({ error: "Order not found" });
  
  const items = db.prepare(`
    SELECT oi.*, p.name as product_name 
    FROM order_items oi 
    JOIN products p ON oi.product_id = p.id 
    WHERE oi.order_id = ?
  `).all(req.params.id) as any[];
  
  res.json({ ...order, items });
});

router.post("/", (req, res) => {
  const { items, shipping_address, invoicing_address, total_price } = req.body;
  
  const insertOrder = db.prepare(`
    INSERT INTO orders (status, shipping_address, invoicing_address, total_price) 
    VALUES (?, ?, ?, ?)
  `);
  
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, price) 
    VALUES (?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    const result = insertOrder.run("received", JSON.stringify(shipping_address), JSON.stringify(invoicing_address), total_price);
    const orderId = Number(result.lastInsertRowid);
    
    for (const item of items) {
      insertItem.run(orderId, item.product_id, item.quantity, item.price);
    }
    return orderId;
  });

  try {
    const orderId = transaction();
    businessLogger.info(`Order created`, { orderId, total_price, status: "received" });
    res.status(201).json({ id: orderId });
  } catch (error: any) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
});

router.patch("/:id/status", (req, res) => {
  const { status, payout_info } = req.body;
  const orderId = req.params.id;
  
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId) as any;
  if (!order) return res.status(404).json({ error: "Order not found" });

  // Business logic: Orders can be canceled only until they are not shipped
  if (status === "canceled" && (order.status === "shipped" || order.status === "delivered")) {
    return res.status(400).json({ error: "Cannot cancel order after it has been shipped" });
  }

  if (payout_info) {
    db.prepare("UPDATE orders SET status = ?, payout_info = ? WHERE id = ?").run(status, JSON.stringify(payout_info), orderId);
  } else {
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, orderId);
  }
  
  businessLogger.info(`Order status changed to ${status}`, { orderId, oldStatus: order.status, newStatus: status });

  // Mock refund logic
  if (status === "refunded") {
    businessLogger.info(`Refund processed for order`, { 
      orderId, 
      amount: order.total_price,
      payoutMethod: payout_info?.method,
      payoutDetails: payout_info?.details
    });
  } else if (status === "canceled" || status === "returned") {
    businessLogger.info(`Order marked for refund`, { orderId, amount: order.total_price });
  }

  res.json({ success: true });
});

export default router;
