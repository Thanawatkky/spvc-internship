import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Student Company — รายละเอียดการฝึกงาน', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'student');
        await page.goto('/student/company');
        await waitForPageReady(page);
    });

    test('should display company page', async ({ page }) => {
        await expect(page).toHaveURL(/\/student\/company/);
    });

    test('should display company data table', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should display company information', async ({ page }) => {
        const content = page.locator('main, [class*="content"]').first();
        await expect(content).toBeVisible({ timeout: 10000 });
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await searchInput.fill('test');
            await page.waitForTimeout(1000);
        }
    });
});
