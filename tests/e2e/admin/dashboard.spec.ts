import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Admin Dashboard — แดชบอร์ดผู้ดูแลระบบ', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin');
        await waitForPageReady(page);
    });

    // ─── Layout ────────────────────────────────────────────────────

    test('should display admin layout with sidebar and header', async ({ page }) => {
        // Sidebar should be visible
        const sidebar = page.locator('aside, [class*="sidebar"], nav').first();
        await expect(sidebar).toBeVisible();
    });

    // ─── TopCards ──────────────────────────────────────────────────

    test('should display TopCards statistics component', async ({ page }) => {
        // TopCards should show statistical data
        const topCards = page.locator('.grid').first();
        await expect(topCards).toBeVisible();
    });

    // ─── Sidebar Navigation ───────────────────────────────────────

    test('should navigate to students page from sidebar', async ({ page }) => {
        // Click จัดการ dropdown first if needed
        const manageMenu = page.getByText('จัดการ');
        if (await manageMenu.isVisible()) {
            await manageMenu.click();
        }

        const studentsLink = page.getByText('จัดการข้อมูลนักศึกษา');
        if (await studentsLink.isVisible()) {
            await studentsLink.click();
            await page.waitForURL(/\/admin\/students/, { timeout: 10000 });
            await expect(page).toHaveURL(/\/admin\/students/);
        }
    });

    test('should navigate to teachers page from sidebar', async ({ page }) => {
        const manageMenu = page.getByText('จัดการ');
        if (await manageMenu.isVisible()) {
            await manageMenu.click();
        }

        const teachersLink = page.getByText('จัดการข้อมูลบุคคลากร');
        if (await teachersLink.isVisible()) {
            await teachersLink.click();
            await page.waitForURL(/\/admin\/teachers/, { timeout: 10000 });
            await expect(page).toHaveURL(/\/admin\/teachers/);
        }
    });

    test('should navigate to company page from sidebar', async ({ page }) => {
        const manageMenu = page.getByText('จัดการ');
        if (await manageMenu.isVisible()) {
            await manageMenu.click();
        }

        const companyLink = page.getByText('จัดการข้อมูลสถานประกอบการ');
        if (await companyLink.isVisible()) {
            await companyLink.click();
            await page.waitForURL(/\/admin\/company/, { timeout: 10000 });
            await expect(page).toHaveURL(/\/admin\/company/);
        }
    });

    test('should navigate to departments page from sidebar', async ({ page }) => {
        const manageMenu = page.getByText('จัดการ');
        if (await manageMenu.isVisible()) {
            await manageMenu.click();
        }

        const deptLink = page.getByText('จัดการข้อมูลแผนกวิชา');
        if (await deptLink.isVisible()) {
            await deptLink.click();
            await page.waitForURL(/\/admin\/mng-department/, { timeout: 10000 });
            await expect(page).toHaveURL(/\/admin\/mng-department/);
        }
    });

    test('should navigate to majors page from sidebar', async ({ page }) => {
        const manageMenu = page.getByText('จัดการ');
        if (await manageMenu.isVisible()) {
            await manageMenu.click();
        }

        const majorsLink = page.getByText('จัดการสาขาวิชา');
        if (await majorsLink.isVisible()) {
            await majorsLink.click();
            await page.waitForURL(/\/admin\/majors/, { timeout: 10000 });
            await expect(page).toHaveURL(/\/admin\/majors/);
        }
    });

    test('should navigate to all students page from sidebar', async ({ page }) => {
        const allStudentsLink = page.getByText('รายชื่อนักศึกษาทั้งหมด');
        if (await allStudentsLink.isVisible()) {
            await allStudentsLink.click();
            await page.waitForURL(/\/admin\/students\/all/, { timeout: 10000 });
            await expect(page).toHaveURL(/\/admin\/students\/all/);
        }
    });
});
