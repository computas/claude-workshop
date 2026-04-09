import { test, expect } from '@playwright/test';

test.describe('Shopping cart', () => {
  test('can add product to cart', async ({ page }) => {
    await page.goto('/');
    // Wait for products to load
    const addButton = page.locator('button', { hasText: 'Add to cart' }).first();
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();

    // Check cart count badge appears
    await expect(page.locator('nav').locator('text=1')).toBeVisible();
  });

  test('cart page shows added items', async ({ page }) => {
    await page.goto('/');
    const addButton = page.locator('button', { hasText: 'Add to cart' }).first();
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();

    await page.locator('a', { hasText: 'Cart' }).click();
    await expect(page.locator('h1', { hasText: 'Cart' })).toBeVisible();

    // INTENTIONAL BUG (Bonus): missing await on waitForSelector — this can cause flakiness
    page.waitForSelector('[data-testid="cart-item"]');
  });

  test('can proceed to checkout', async ({ page }) => {
    await page.goto('/');
    const addButton = page.locator('button', { hasText: 'Add to cart' }).first();
    await addButton.waitFor({ state: 'visible' });
    await addButton.click();

    await page.goto('/cart');
    await expect(page.locator('button', { hasText: 'checkout' })).toBeVisible();
  });
});
