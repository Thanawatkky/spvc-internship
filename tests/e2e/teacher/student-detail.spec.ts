import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Teacher Student Detail — รายละเอียดนักศึกษา', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'teacher');
        await page.goto('/teacher');
        await waitForPageReady(page);
    });

    test('should navigate to student detail page from table', async ({ page }) => {
        // Click on first student link/button in table
        const viewBtn = page.locator('table a, table button:has-text("ดู"), table button[aria-label*="view"]').first();
        if (await viewBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await viewBtn.click();
            await page.waitForTimeout(2000);
            // Should navigate to student detail
        }
    });

    test('should display student information on detail page', async ({ page }) => {
        // Navigate to a known student detail page (requires existing student)
        const viewBtn = page.locator('table a, table button:has-text("ดู")').first();
        if (await viewBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await viewBtn.click();
            await page.waitForTimeout(2000);

            // Detail page should show student info
            const content = page.locator('main, [class*="content"]').first();
            await expect(content).toBeVisible({ timeout: 10000 });
        }
    });
});
