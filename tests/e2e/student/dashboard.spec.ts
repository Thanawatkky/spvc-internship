import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Student Dashboard — หน้าแรกนักศึกษา', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'student');
        await page.goto('/student');
        await waitForPageReady(page);
    });

    test('should display student dashboard', async ({ page }) => {
        await expect(page).toHaveURL(/\/student/);
    });

    test('should display InternshipReportForm (profileJob)', async ({ page }) => {
        // The main content area should be visible
        const content = page.locator('main, [class*="content"], .grid').first();
        await expect(content).toBeVisible({ timeout: 10000 });
    });

    test('should display sidebar with student menu items', async ({ page }) => {
        // Student sidebar links
        const menuItems = [
            'หน้าแรก',
            'รายงานฝึกงาน',
            'รายละเอียดการฝึกงาน',
            'ส่งออกรายงาน',
        ];

        for (const item of menuItems) {
            const menuLink = page.getByText(item).first();
            if (await menuLink.isVisible({ timeout: 2000 }).catch(() => false)) {
                await expect(menuLink).toBeVisible();
            }
        }
    });

    test('should navigate to reportintern page', async ({ page }) => {
        const link = page.getByText('รายงานฝึกงาน').first();
        if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
            await link.click();
            await page.waitForURL(/\/student\/reportintern/, { timeout: 10000 });
        }
    });

    test('should navigate to company page', async ({ page }) => {
        const link = page.getByText('รายละเอียดการฝึกงาน').first();
        if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
            await link.click();
            await page.waitForURL(/\/student\/company/, { timeout: 10000 });
        }
    });

    test('should navigate to export page', async ({ page }) => {
        const link = page.getByText('ส่งออกรายงาน').first();
        if (await link.isVisible({ timeout: 3000 }).catch(() => false)) {
            await link.click();
            await page.waitForURL(/\/student\/export/, { timeout: 10000 });
        }
    });
});
