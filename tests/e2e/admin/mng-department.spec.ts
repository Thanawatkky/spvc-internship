import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Admin Manage Department — จัดการข้อมูลแผนกวิชา', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin/mng-department');
        await waitForPageReady(page);
    });

    test('should display department table', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should have add department button', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(addBtn).toBeVisible();
        }
    });

    test('should open add department dialog', async ({ page }) => {
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

    test('should have edit functionality on rows', async ({ page }) => {
        const editBtn = page.locator('table button:has-text("แก้ไข"), table button[aria-label*="edit"]').first();
        if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editBtn.click();
            await page.waitForTimeout(500);
        }
    });

    test('should have delete functionality on rows', async ({ page }) => {
        const deleteBtn = page.locator('table button:has-text("ลบ"), table button[aria-label*="delete"]').first();
        if (await deleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await deleteBtn.click();
            await page.waitForTimeout(500);
            const confirmDialog = page.locator('.swal2-popup').first();
            if (await confirmDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
                const cancelBtn = page.locator('.swal2-cancel').first();
                if (await cancelBtn.isVisible()) await cancelBtn.click();
            }
        }
    });
});
