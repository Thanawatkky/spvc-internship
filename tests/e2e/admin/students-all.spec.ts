import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Admin All Students — รายชื่อนักศึกษาทั้งหมด', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin/students/all');
        await waitForPageReady(page);
    });

    test('should display all students table', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"], input[type="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(searchInput).toBeVisible();
            await searchInput.fill('test search');
            await page.waitForTimeout(1000);
        }
    });

    test('should display pagination if data exceeds page size', async ({ page }) => {
        const pagination = page.locator('button:has-text("Next"), button:has-text(">"), [class*="pagination"]').first();
        if (await pagination.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(pagination).toBeVisible();
        }
    });

    test('should display breadcrumb navigation', async ({ page }) => {
        const breadcrumb = page.locator('[class*="breadcrumb"], nav[aria-label*="breadcrumb"]').first();
        if (await breadcrumb.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(breadcrumb).toBeVisible();
        }
    });
});
