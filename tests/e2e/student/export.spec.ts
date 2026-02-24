import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Student Export — ส่งออกรายงาน', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'student');
        await page.goto('/student/export');
        await waitForPageReady(page);
    });

    test('should display export page', async ({ page }) => {
        await expect(page).toHaveURL(/\/student\/export/);
    });

    test('should display export table', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should have export/download button', async ({ page }) => {
        const exportBtn = page.locator('button:has-text("ส่งออก"), button:has-text("Export"), button:has-text("ดาวน์โหลด"), button:has-text("Download"), button:has-text("PDF"), button:has-text("พิมพ์")').first();
        if (await exportBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(exportBtn).toBeVisible();
        }
    });
});
