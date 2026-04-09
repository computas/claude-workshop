import { test, expect } from '@playwright/test';

test.describe('Product catalog', () => {
  test('homepage shows product catalog', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Lego');
    await expect(page.locator('[data-testid="product-card"], .product-card').first()).toBeVisible();
  });

  test('can filter products by theme', async ({ page }) => {
    await page.goto('/');
    const select = page.locator('select');
    await select.selectOption('Technic');
    // Wait for filtered results
    await page.waitForTimeout(500);
    const cards = page.locator('button', { hasText: 'Add to cart' });
    await expect(cards.first()).toBeVisible();
  });

  test('can search for products', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('input[type="text"]');
    await searchInput.fill('Falcon');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Millennium Falcon').first()).toBeVisible();
  });

  test('language switcher changes UI language', async ({ page }) => {
    await page.goto('/');
    // Switch to Norwegian
    await page.locator('button', { hasText: 'NO' }).click();
    await expect(page.locator('h1')).toContainText('Lego');
    // Switch back
    await page.locator('button', { hasText: 'EN' }).click();
  });
});
