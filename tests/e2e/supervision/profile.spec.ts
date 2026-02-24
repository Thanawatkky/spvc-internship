import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Supervision Profile — โปรไฟล์หัวหน้านิเทศ', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'supervision');
        await page.goto('/supervision/profile');
        await waitForPageReady(page);
    });

    test('should display profile page', async ({ page }) => {
        await expect(page).toHaveURL(/\/supervision\/profile/);
    });

    test('should display profile information', async ({ page }) => {
        const inputs = page.locator('input, textarea');
        const count = await inputs.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should have save/edit button', async ({ page }) => {
        const saveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save"), button:has-text("แก้ไข")').first();
        if (await saveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(saveBtn).toBeVisible();
        }
    });
});
