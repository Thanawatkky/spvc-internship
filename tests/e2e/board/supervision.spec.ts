import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Board Supervision — ข้อมูลหัวหน้างานนิเทศ', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'board');
        await page.goto('/board/supervision');
        await waitForPageReady(page);
    });

    test('should display supervision page', async ({ page }) => {
        await expect(page).toHaveURL(/\/board\/supervision/);
    });

    test('should display supervision data', async ({ page }) => {
        const content = page.locator('main, [class*="content"], table').first();
        await expect(content).toBeVisible({ timeout: 15000 });
    });
});
