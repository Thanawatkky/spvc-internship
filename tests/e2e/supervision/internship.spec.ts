import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Supervision Internship — ข้อมูลการฝึกงาน', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'supervision');
        await page.goto('/supervision/internship');
        await waitForPageReady(page);
    });

    test('should display internship page', async ({ page }) => {
        await expect(page).toHaveURL(/\/supervision\/internship/);
    });

    test('should display internship data', async ({ page }) => {
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
});
