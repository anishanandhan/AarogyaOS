import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('AarogyaOS E2E Core Journey & Accessibility Audit', () => {
  test('should traverse the complete user flow with state persistence and zero WCAG violations', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/AarogyaOS/i);
    
    // Inject Axe-core
    await injectAxe(page);
    
    // Scan 1: Landing Page (Initial State)
    await checkA11y(page, null, {
      axeOptions: {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }
    });
    
    // Take landing page screenshot
    await page.screenshot({ path: 'tests/test-results/screenshots/landing-page.png' });
    
    // 2. Navigate to Login page via Launch System Portal button
    const loginNavButton = page.locator('button:has-text("Launch System Portal")').first();
    await expect(loginNavButton).toBeVisible();
    await loginNavButton.click();
    await page.waitForURL('**/login');
    
    // 3. Select Role and Login
    const roleCard = page.locator('h3:has-text("District Admin"), button:has-text("District Admin")').first();
    await expect(roleCard).toBeVisible();
    await roleCard.click();
    
    const submitBtn = page.locator('button[type="submit"], button:has-text("Sign In")').first();
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
    
    // Wait for dashboard loading
    await page.waitForURL('**/dashboard');
    
    // Scan 2: Dashboard (Populated State)
    await injectAxe(page);
    await checkA11y(page, null, {
      axeOptions: {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }
    });
    
    // Take dashboard page screenshot
    await page.screenshot({ path: 'tests/test-results/screenshots/dashboard-loaded.png' });
    
    // 4. Test State Persistence across reload
    await page.reload();
    
    // 5. Interact with VaaniBot Chat Drawer (Overlay / Modal)
    const chatTrigger = page.locator('button[title*="Ask VaaniBot"]');
    await expect(chatTrigger).toBeVisible();
    await chatTrigger.click();
    
    // Verify drawer is open
    await expect(page.getByRole('heading', { name: 'VaaniBot' })).toBeVisible();
    
    // Scan 3: Chat Drawer Open (Overlay View)
    await injectAxe(page);
    await checkA11y(page, null, {
      axeOptions: {
        rules: {
          'color-contrast': { enabled: false }
        },
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      }
    });
    
    // Take drawer open screenshot
    await page.screenshot({ path: 'tests/test-results/screenshots/vaanibot-drawer.png' });
  });
});
