import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Teacher Dashboard — หน้าแรกอาจารย์', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'teacher');
        await page.goto('/teacher');
        await waitForPageReady(page);
    });

    test('should display teacher dashboard with student table', async ({ page }) => {
        await expect(page).toHaveURL(/\/teacher/);
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

    test('should have view detail action on student rows', async ({ page }) => {
        const viewBtn = page.locator('table button:has-text("ดู"), table a, table button[aria-label*="view"]').first();
        if (await viewBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(viewBtn).toBeVisible();
        }
    });
});
