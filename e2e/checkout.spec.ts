import { test, expect } from '@playwright/test';

test.describe('Shopping cart', () => {
  test('adds item to cart and shows count', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="add-to-cart-button"]');
    await page.locator('[data-testid="add-to-cart-button"]').first().click();

    // INTENTIONAL BUG: Missing waitForSelector before asserting cart count.
    // This causes a race condition — on fast machines it passes, on slow CI it fails
    // because the cart state update hasn't propagated to the header yet.
    // Fix: add `await page.waitForSelector('[data-testid="cart-count"]')`
    const cartCount = page.locator('[data-testid="cart-count"]');
    await expect(cartCount).toHaveText('1');
  });

  test('navigates to checkout page', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="add-to-cart-button"]');
    await page.locator('[data-testid="add-to-cart-button"]').first().click();

    await page.waitForSelector('[data-testid="cart-count"]');
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');
  });

  test('checkout form shows required fields', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="add-to-cart-button"]');
    await page.locator('[data-testid="add-to-cart-button"]').first().click();
    await page.waitForSelector('[data-testid="cart-count"]');

    await page.goto('/checkout');
    await expect(page.locator('input[name="shipping_name"]')).toBeVisible();
    await expect(page.locator('input[name="shipping_address"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('completes checkout and shows confirmation', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="add-to-cart-button"]');
    await page.locator('[data-testid="add-to-cart-button"]').first().click();
    await page.waitForSelector('[data-testid="cart-count"]');

    await page.goto('/checkout');

    await page.fill('input[name="shipping_name"]', 'Ola Nordmann');
    await page.fill('input[name="shipping_address"]', 'Storgata 1');
    await page.fill('input[name="shipping_city"]', 'Oslo');
    await page.fill('input[name="shipping_zip"]', '0150');
    await page.fill('input[name="email"]', 'ola@example.com');

    const sameAddressCheckbox = page.locator('input[type="checkbox"]');
    if (await sameAddressCheckbox.isVisible()) {
      await sameAddressCheckbox.check();
    }

    await page.click('button[type="submit"]');
    await page.waitForURL(/\/order\/\d+/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText('Bestilling bekreftet');
  });
});
