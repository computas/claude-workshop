import { test, expect } from '@playwright/test';

test.describe('Admin panel', () => {
  test('admin page is accessible', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText('Admin');
  });

  test('shows orders tab', async ({ page }) => {
    await page.goto('/admin');
    const ordersTab = page.locator('button', { hasText: 'Orders' });
    await expect(ordersTab).toBeVisible();
  });

  test('shows dashboard tab with placeholder', async ({ page }) => {
    await page.goto('/admin');
    await page.locator('button', { hasText: 'Dashboard' }).click();
    // INTENTIONAL BUG visible: Dashboard is a placeholder
    await expect(page.locator('text=TODO: Dashboard')).toBeVisible();
  });

  test('can filter orders by status', async ({ page }) => {
    await page.goto('/admin');
    const statusSelect = page.locator('select');
    await expect(statusSelect).toBeVisible();
    await statusSelect.selectOption('received');
  });
});
