import type { Order, OrderItem, OrderStatus, OrderStats, ShippingAddress } from '@workshop/shared';
import { getDb } from '../database/db.js';
import { getCart, clearCart } from './cartService.js';
import { chargePayment, refundPayment } from './paymentService.js';
import { logOrderEvent } from '../utils/logger.js';
import { updateStock } from './productService.js';

interface DbOrder {
  id: number;
  session_id: string;
  status: OrderStatus;
  shipping_address: string;
  billing_address: string;
  total: number;
  transaction_id: string | null;
  refunded: number;
  created_at: string;
  updated_at: string;
}

interface DbOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

function toOrder(row: DbOrder, items: DbOrderItem[]): Order {
  return {
    id: row.id,
    sessionId: row.session_id,
    status: row.status,
    items: items.map(i => ({
      productId: i.product_id,
      productName: i.product_name,
      quantity: i.quantity,
      unitPrice: i.unit_price,
    })),
    shippingAddress: JSON.parse(row.shipping_address) as ShippingAddress,
    billingAddress: JSON.parse(row.billing_address) as ShippingAddress,
    total: row.total,
    transactionId: row.transaction_id,
    refunded: row.refunded === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getOrderById(id: number): Order | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as DbOrder | undefined;
  if (!row) return null;
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id) as DbOrderItem[];
  return toOrder(row, items);
}

export function getAllOrders(status?: OrderStatus): Order[] {
  const db = getDb();
  const rows = status
    ? (db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC').all(status) as DbOrder[])
    : (db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as DbOrder[]);

  return rows.map(row => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id) as DbOrderItem[];
    return toOrder(row, items);
  });
}

export function createOrder(
  sessionId: string,
  shippingAddress: ShippingAddress,
  billingAddress: ShippingAddress,
  paymentToken: string
): Order {
  const db = getDb();
  const cart = getCart(sessionId);
  if (cart.items.length === 0) throw new Error('Cart is empty');

  const payment = chargePayment(paymentToken, cart.total);
  if (!payment.success) throw new Error('Payment failed');

  const insertOrder = db.prepare(`
    INSERT INTO orders (session_id, status, shipping_address, billing_address, total, transaction_id)
    VALUES (?, 'received', ?, ?, ?, ?)
  `);

  const result = insertOrder.run(
    sessionId,
    JSON.stringify(shippingAddress),
    JSON.stringify(billingAddress),
    cart.total,
    payment.transactionId
  );

  const orderId = result.lastInsertRowid as number;

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const item of cart.items) {
    insertItem.run(orderId, item.productId, item.product.name, item.quantity, item.product.price);
    updateStock(item.productId, -item.quantity);
  }

  clearCart(sessionId);

  logOrderEvent(orderId, 'order_created', {
    total: cart.total,
    items: cart.items.length,
    transactionId: payment.transactionId,
  });

  return getOrderById(orderId)!;
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  received: ['confirmed', 'canceled'],
  confirmed: ['shipped', 'canceled'],
  canceled: [],
  shipped: ['delivered', 'awaiting_return'],
  delivered: ['awaiting_return'],
  awaiting_return: ['returned'],
  returned: [],
};

export function updateOrderStatus(orderId: number, newStatus: OrderStatus): Order {
  const db = getDb();
  const order = getOrderById(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);

  const allowed = VALID_TRANSITIONS[order.status];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Cannot transition from '${order.status}' to '${newStatus}'`);
  }

  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(newStatus, orderId);
  logOrderEvent(orderId, 'status_changed', { from: order.status, to: newStatus });

  return getOrderById(orderId)!;
}

const ALL_STATUSES: OrderStatus[] = ['received', 'confirmed', 'canceled', 'shipped', 'delivered', 'awaiting_return', 'returned'];

export function getOrderStats(): OrderStats {
  const db = getDb();

  const rows = db.prepare(
    'SELECT status, COUNT(*) as count, COALESCE(SUM(total), 0) as revenue FROM orders GROUP BY status'
  ).all() as { status: OrderStatus; count: number; revenue: number }[];

  const countByStatus = Object.fromEntries(ALL_STATUSES.map(s => [s, 0])) as Record<OrderStatus, number>;
  let totalRevenue = 0;
  let totalOrders = 0;

  for (const row of rows) {
    countByStatus[row.status] = row.count;
    totalRevenue += row.revenue;
    totalOrders += row.count;
  }

  return { countByStatus, totalRevenue, totalOrders };
}

export function refundOrder(orderId: number): Order {
  const db = getDb();
  const order = getOrderById(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (!['canceled', 'returned'].includes(order.status)) {
    throw new Error('Only canceled or returned orders can be refunded');
  }
  if (order.refunded) throw new Error('Order already refunded');
  if (!order.transactionId) throw new Error('No transaction to refund');

  const refund = refundPayment(order.transactionId);
  if (!refund.success) throw new Error('Refund failed');

  db.prepare("UPDATE orders SET refunded = 1, updated_at = datetime('now') WHERE id = ?").run(orderId);
  logOrderEvent(orderId, 'order_refunded', { refundTransactionId: refund.transactionId });

  return getOrderById(orderId)!;
}
