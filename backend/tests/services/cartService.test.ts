import { describe, it, expect } from 'vitest';
import { createOrder } from '../../src/services/orderService';

// NOTE: This test file is intentionally incomplete.
// It only covers the happy path for order creation.
// Missing tests (for workshop participants to add):
//   - Empty cart validation
//   - Invalid product IDs
//   - Invalid quantities (zero, negative)
//   - Stock availability checking
//   - Missing required fields

const validOrderData = {
  items: [
    { product_id: 1, quantity: 2, unit_price: 249 },
    { product_id: 2, quantity: 1, unit_price: 399 },
  ],
  total: 897,
  shipping_name: 'Ola Nordmann',
  shipping_address: 'Kongens gate 1',
  shipping_city: 'Oslo',
  shipping_zip: '0153',
  billing_name: 'Ola Nordmann',
  billing_address: 'Kongens gate 1',
  billing_city: 'Oslo',
  billing_zip: '0153',
  email: 'ola@example.com',
};

describe('cartService (orderService)', () => {
  it('createOrder with valid data creates an order and returns it with items', () => {
    const order = createOrder(validOrderData);

    expect(order).not.toBeNull();
    expect(order.id).toBeGreaterThan(0);
    expect(order.status).toBe('pending');
    expect(order.email).toBe(validOrderData.email);
    expect(order.shipping_name).toBe(validOrderData.shipping_name);
    expect(Array.isArray(order.items)).toBe(true);
    expect(order.items).toHaveLength(2);
  });

  it('createOrder stores the correct total', () => {
    const order = createOrder(validOrderData);
    expect(order.total).toBe(validOrderData.total);
  });
});
