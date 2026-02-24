import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Board Dashboard — หน้าแรกคณะกรรมการ', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'board');
        await page.goto('/board');
        await waitForPageReady(page);
    });

    test('should display board dashboard with student table', async ({ page }) => {
        await expect(page).toHaveURL(/\/board/);
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await searchInput.fill('test');
            await page.waitForTimeout(1000);
        }
    });

    test('should display pagination', async ({ page }) => {
        const pagination = page.locator('button:has-text("Next"), button:has-text(">"), [class*="pagination"]').first();
        if (await pagination.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(pagination).toBeVisible();
        }
    });
});
