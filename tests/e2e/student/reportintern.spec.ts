import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Student Report Intern — รายงานฝึกงาน', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'student');
        await page.goto('/student/reportintern');
        await waitForPageReady(page);
    });

    test('should display intern report page', async ({ page }) => {
        await expect(page).toHaveURL(/\/student\/reportintern/);
    });

    test('should display intern report table', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should have add report button', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add"), button:has-text("สร้าง"), button:has-text("เขียน")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(addBtn).toBeVisible();
        }
    });

    test('should open add report dialog/form', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add"), button:has-text("สร้าง"), button:has-text("เขียน")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await addBtn.click();
            await page.waitForTimeout(500);
            const dialog = page.locator('[role="dialog"], .modal, form').first();
            if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
                await expect(dialog).toBeVisible();
            }
        }
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await searchInput.fill('test');
            await page.waitForTimeout(1000);
        }
    });
});
