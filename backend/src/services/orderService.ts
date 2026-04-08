import { CreateOrderRequest, Order, OrderWithItems, OrderItem } from '@workshop/shared';
import { getDatabase } from '../database';

export function createOrder(data: CreateOrderRequest): OrderWithItems {
  const db = getDatabase();

  const insertOrder = db.prepare(
    `INSERT INTO orders (status, total, shipping_name, shipping_address, shipping_city, shipping_zip,
      billing_name, billing_address, billing_city, billing_zip, email, payment_status)
     VALUES ('pending', @total, @shipping_name, @shipping_address, @shipping_city, @shipping_zip,
      @billing_name, @billing_address, @billing_city, @billing_zip, @email, 'pending')`
  );

  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
     VALUES (@order_id, @product_id, @quantity, @unit_price)`
  );

  const transaction = db.transaction(() => {
    const result = insertOrder.run({
      total: data.total,
      shipping_name: data.shipping_name,
      shipping_address: data.shipping_address,
      shipping_city: data.shipping_city,
      shipping_zip: data.shipping_zip,
      billing_name: data.billing_name,
      billing_address: data.billing_address,
      billing_city: data.billing_city,
      billing_zip: data.billing_zip,
      email: data.email,
    });

    const orderId = result.lastInsertRowid as number;

    for (const item of data.items) {
      insertItem.run({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      });
    }

    return orderId;
  });

  const orderId = transaction() as number;
  return getOrderById(orderId) as OrderWithItems;
}

export function getOrderById(id: number): OrderWithItems | null {
  const db = getDatabase();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as Order | undefined;
  if (!order) {
    return null;
  }

  const items = db
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .all(id) as OrderItem[];

  return { ...order, items };
}
