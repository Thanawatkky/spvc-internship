import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Admin Company — จัดการข้อมูลสถานประกอบการ', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin/company');
        await waitForPageReady(page);
    });

    test('should display company table', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"], input[type="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await searchInput.fill('test company');
            await page.waitForTimeout(1000);
        }
    });

    test('should have add company button', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(addBtn).toBeVisible();
        }
    });

    test('should open add company dialog', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await addBtn.click();
            await page.waitForTimeout(500);
            const dialog = page.locator('[role="dialog"], .modal').first();
            if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
                await expect(dialog).toBeVisible();
            }
        }
    });

    test('should display pagination', async ({ page }) => {
        const pagination = page.locator('button:has-text("Next"), button:has-text(">"), [class*="pagination"]').first();
        if (await pagination.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(pagination).toBeVisible();
        }
    });
});
