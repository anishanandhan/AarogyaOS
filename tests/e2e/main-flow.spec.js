import { test, expect } from '@playwright/test';

test.describe('AarogyaOS E2E Core Flow', () => {
  test('should load login page, login as District Admin, and display dashboard', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');
    
    // Assert title
    await expect(page).toHaveTitle(/AarogyaOS/i);
    
    // 2. Select the first role (District Admin button)
    const adminButton = page.locator('button').first();
    await expect(adminButton).toBeVisible();
    await adminButton.click();
    
    // 3. Wait for navigation to /dashboard
    await page.waitForURL('**/dashboard');
    
    // 4. Assert dashboard content
    const dashboardTitle = page.getByText('District Command Dashboard');
    await expect(dashboardTitle).toBeVisible();
  });
});
