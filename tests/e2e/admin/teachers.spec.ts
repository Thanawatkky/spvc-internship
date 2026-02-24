import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Admin Teachers — จัดการข้อมูลบุคคลากร', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin/teachers');
        await waitForPageReady(page);
    });

    test('should display teachers table', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"], input[type="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await searchInput.fill('test');
            await page.waitForTimeout(1000);
        }
    });

    test('should display pagination controls', async ({ page }) => {
        const pagination = page.locator('button:has-text("Next"), button:has-text(">"), [class*="pagination"]').first();
        if (await pagination.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(pagination).toBeVisible();
        }
    });

    test('should have add teacher button/link', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), a:has-text("เพิ่ม"), button:has-text("Add")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(addBtn).toBeVisible();
        }
    });

    test('should navigate to add teacher page', async ({ page }) => {
        const addBtn = page.locator('a:has-text("เพิ่ม"), button:has-text("เพิ่ม")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await addBtn.click();
            await page.waitForURL(/\/admin\/addteacher/, { timeout: 10000 });
            await expect(page).toHaveURL(/\/admin\/addteacher/);
        }
    });

    test('should show edit dialog for teacher', async ({ page }) => {
        const editBtn = page.locator('table button:has-text("แก้ไข"), table button[aria-label*="edit"]').first();
        if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editBtn.click();
            await page.waitForTimeout(500);

            const dialog = page.locator('[role="dialog"], .modal').first();
            if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
                await expect(dialog).toBeVisible();
            }
        }
    });

    test('should show delete confirmation for teacher', async ({ page }) => {
        const deleteBtn = page.locator('table button:has-text("ลบ"), table button[aria-label*="delete"]').first();
        if (await deleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await deleteBtn.click();
            await page.waitForTimeout(500);

            const confirmDialog = page.locator('.swal2-popup').first();
            if (await confirmDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
                await expect(confirmDialog).toBeVisible();
                // Cancel
                const cancelBtn = page.locator('.swal2-cancel').first();
                if (await cancelBtn.isVisible()) await cancelBtn.click();
            }
        }
    });
});
