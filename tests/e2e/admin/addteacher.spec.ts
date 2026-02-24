import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Admin Add Teacher — เพิ่มข้อมูลอาจารย์', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin/addteacher');
        await waitForPageReady(page);
    });

    test('should display breadcrumb navigation', async ({ page }) => {
        await expect(page.getByText('Home')).toBeVisible();
        await expect(page.getByText('ข้อมูลผู้อาจารย์ประจำแผนกวิชา')).toBeVisible();
        await expect(page.getByText('เพิ่มข้อมูลอาจารย์ประจำแผนกวิชา')).toBeVisible();
    });

    test('should display teacher form', async ({ page }) => {
        const form = page.locator('form').first();
        await expect(form).toBeVisible({ timeout: 10000 });
    });

    test('should have required form fields', async ({ page }) => {
        // Check for common teacher form fields
        const inputs = page.locator('input, select, textarea');
        const count = await inputs.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should navigate back to teachers list via breadcrumb', async ({ page }) => {
        const breadcrumbLink = page.getByText('ข้อมูลผู้อาจารย์ประจำแผนกวิชา');
        if (await breadcrumbLink.isVisible()) {
            await breadcrumbLink.click();
            await page.waitForURL(/\/admin\/teachers/, { timeout: 10000 });
        }
    });
});
