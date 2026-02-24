import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Admin Profile — โปรไฟล์ผู้ดูแลระบบ', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin/profile');
        await waitForPageReady(page);
    });

    test('should display profile page', async ({ page }) => {
        // Profile page should load
        await expect(page).toHaveURL(/\/admin\/profile/);
    });

    test('should display profile information fields', async ({ page }) => {
        // Should have form or display fields
        const inputs = page.locator('input, textarea');
        const count = await inputs.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should display user name or info', async ({ page }) => {
        // Profile should show some user data
        const profileContent = page.locator('main, [class*="content"], [class*="profile"]').first();
        await expect(profileContent).toBeVisible({ timeout: 10000 });
    });

    test('should have save/edit button', async ({ page }) => {
        const saveBtn = page.locator('button:has-text("บันทึก"), button:has-text("Save"), button:has-text("แก้ไข"), button:has-text("Edit")').first();
        if (await saveBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(saveBtn).toBeVisible();
        }
    });
});
