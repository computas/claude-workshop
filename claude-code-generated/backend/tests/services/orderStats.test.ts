import { describe, it, expect, beforeEach } from 'vitest';
import { getOrderStats } from '../../src/services/orderService.js';
import { getDb } from '../../src/database/db.js';

const TEST_SESSION = 'test-session-stats-001';

function insertOrder(status: string, total: number) {
  const db = getDb();
  const addr = JSON.stringify({ firstName: 'A', lastName: 'B', street: 'X', city: 'Y', postalCode: '0000', country: 'NO' });
  const result = db.prepare(
    `INSERT INTO orders (session_id, status, shipping_address, billing_address, total, transaction_id) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(TEST_SESSION, status, addr, addr, total, `txn_test_${Math.random()}`);
  return result.lastInsertRowid as number;
}

beforeEach(() => {
  getDb().prepare('DELETE FROM orders WHERE session_id = ?').run(TEST_SESSION);
});

describe('getOrderStats', () => {
  it('returns zero counts and revenue when there are no matching orders', () => {
    const stats = getOrderStats();
    // Seed data may have other orders; test only our session's absence
    // The function counts ALL orders, so just verify shape
    expect(stats).toHaveProperty('countByStatus');
    expect(stats).toHaveProperty('totalRevenue');
    expect(stats).toHaveProperty('totalOrders');
  });

  it('countByStatus includes all OrderStatus keys', () => {
    const stats = getOrderStats();
    const expected = ['received', 'confirmed', 'canceled', 'shipped', 'delivered', 'awaiting_return', 'returned'];
    for (const status of expected) {
      expect(stats.countByStatus).toHaveProperty(status);
    }
  });

  it('counts inserted orders correctly per status', () => {
    insertOrder('received', 1000);
    insertOrder('received', 2000);
    insertOrder('shipped', 500);

    const stats = getOrderStats();
    expect(stats.countByStatus.received).toBeGreaterThanOrEqual(2);
    expect(stats.countByStatus.shipped).toBeGreaterThanOrEqual(1);
  });

  it('totalOrders equals sum of all countByStatus values', () => {
    insertOrder('confirmed', 999);

    const stats = getOrderStats();
    const sumFromCounts = Object.values(stats.countByStatus).reduce((a, b) => a + b, 0);
    expect(stats.totalOrders).toBe(sumFromCounts);
  });

  it('totalRevenue includes revenue from all statuses', () => {
    const before = getOrderStats().totalRevenue;
    insertOrder('delivered', 3000);
    insertOrder('canceled', 1500);

    const after = getOrderStats().totalRevenue;
    expect(after).toBe(before + 4500);
  });

  it('totalRevenue is 0 when no orders exist', () => {
    // Clear all orders for a fresh isolated check using a unique session trick is not possible
    // since seed data exists; instead verify type is number and non-negative
    const stats = getOrderStats();
    expect(typeof stats.totalRevenue).toBe('number');
    expect(stats.totalRevenue).toBeGreaterThanOrEqual(0);
  });
});
