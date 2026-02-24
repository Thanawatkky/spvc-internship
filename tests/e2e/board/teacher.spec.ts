import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Board Teacher — ข้อมูลอาจารย์', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'board');
        await page.goto('/board/teacher');
        await waitForPageReady(page);
    });

    test('should display teacher page', async ({ page }) => {
        await expect(page).toHaveURL(/\/board\/teacher/);
    });

    test('should display teacher data', async ({ page }) => {
        const content = page.locator('main, [class*="content"], table').first();
        await expect(content).toBeVisible({ timeout: 15000 });
    });
});
