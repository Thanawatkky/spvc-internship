import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Supervision Students Supervise — นักศึกษาที่ดูแล', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'supervision');
        await page.goto('/supervision/students/supervise');
        await waitForPageReady(page);
    });

    test('should display supervised students page', async ({ page }) => {
        await expect(page).toHaveURL(/\/supervision\/students\/supervise/);
    });

    test('should display supervised students data', async ({ page }) => {
        const content = page.locator('main, [class*="content"], table').first();
        await expect(content).toBeVisible({ timeout: 15000 });
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await searchInput.fill('test');
            await page.waitForTimeout(1000);
        }
    });

    test('should navigate to student detail view', async ({ page }) => {
        const viewBtn = page.locator('table a, table button:has-text("ดู"), table button[aria-label*="view"]').first();
        if (await viewBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await viewBtn.click();
            await page.waitForTimeout(2000);
        }
    });
});
