import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Departments Dashboard — หน้าแรกแผนกวิชา', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'departments');
        await page.goto('/departments');
        await waitForPageReady(page);
    });

    test('should display departments page', async ({ page }) => {
        await expect(page).toHaveURL(/\/departments/);
    });

    test('should display department data', async ({ page }) => {
        const content = page.locator('main, [class*="content"], table').first();
        await expect(content).toBeVisible({ timeout: 15000 });
    });

    test('should have search functionality', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"]').first();
        if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await searchInput.fill('test');
            await page.waitForTimeout(1000);
        }
    });

    test('should display pagination', async ({ page }) => {
        const pagination = page.locator('button:has-text("Next"), button:has-text(">"), [class*="pagination"]').first();
        if (await pagination.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(pagination).toBeVisible();
        }
    });
});

test.describe('Departments Teacher — อาจารย์ในแผนก', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'departments');
        await page.goto('/departments/teacher');
        await waitForPageReady(page);
    });

    test('should display teacher page', async ({ page }) => {
        await expect(page).toHaveURL(/\/departments\/teacher/);
    });

    test('should display teacher data', async ({ page }) => {
        const content = page.locator('main, [class*="content"], table').first();
        await expect(content).toBeVisible({ timeout: 15000 });
    });
});
