import { describe, it, expect } from 'vitest';

describe('Frontend Utils', () => {
  it('should calculate cart total correctly', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 500, quantity: 1 }
    ];
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBe(700);
  });
});
