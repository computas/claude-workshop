import { test, expect } from '@playwright/test';

test.describe('Admin product management', () => {
  test('shows product list in admin', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForSelector('table');
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(50);
  });

  test('admin dashboard shows placeholder', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('text=TODO')).toBeVisible();
  });

  test('creates a new product', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForSelector('table');

    await page.click('button:has-text("Nytt produkt")');
    await page.waitForSelector('form');

    await page.fill('input[name="name"]', 'Testprodukt Dragestein');
    await page.fill('textarea[name="description"]', 'Et testprodukt for workshop-demonstrasjon.');
    await page.fill('input[name="price"]', '499');
    await page.selectOption('select[name="category"]', 'Fabeldyr og drager');
    await page.fill('input[name="stock"]', '50');

    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Testprodukt Dragestein');
    await expect(page.locator('text=Testprodukt Dragestein')).toBeVisible();
  });

  test('deletes a product', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForSelector('table');

    const rowsBefore = await page.locator('tbody tr').count();
    await page.locator('button:has-text("Slett")').first().click();
    const rowsAfter = await page.locator('tbody tr').count();
    expect(rowsAfter).toBe(rowsBefore - 1);
  });
});
