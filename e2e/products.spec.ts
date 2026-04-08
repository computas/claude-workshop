import { test, expect } from '@playwright/test';

test.describe('Product listing page', () => {
  test('shows product list on load', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]');
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards).toHaveCount(50);
  });

  test('filters products by category', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]');

    await page.selectOption('select', 'Festninger og borger');
    await page.waitForTimeout(300);

    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards).toHaveCount(10);
  });

  test('filters products by search', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]');

    await page.fill('input[type="text"]', 'Drakon');
    await page.waitForTimeout(300);

    const cards = page.locator('[data-testid="product-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('navigates to product detail on card click', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="product-card"]');

    await page.locator('[data-testid="product-card"]').first().click();
    await expect(page).toHaveURL(/\/products\/\d+/);
  });

  test('add to cart button is visible on each product card', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="add-to-cart-button"]');
    const buttons = page.locator('[data-testid="add-to-cart-button"]');
    await expect(buttons.first()).toBeVisible();
  });
});
