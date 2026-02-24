import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Access Control — ควบคุมการเข้าถึงตาม Role', () => {

    // ─── Admin Role ────────────────────────────────────────────────

    test('admin should access /admin pages', async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/\/admin/);
    });

    test('admin should NOT access /student pages', async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/student');
        await page.waitForURL(/\/(protected|admin)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/student');
    });

    test('admin should NOT access /teacher pages', async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/teacher');
        await page.waitForURL(/\/(protected|admin)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/teacher');
    });

    test('admin should NOT access /board pages', async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/board');
        await page.waitForURL(/\/(protected|admin)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/board');
    });

    // ─── Student Role ─────────────────────────────────────────────

    test('student should access /student pages', async ({ page }) => {
        await loginAs(page, 'student');
        await page.goto('/student');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/\/student/);
    });

    test('student should NOT access /admin pages', async ({ page }) => {
        await loginAs(page, 'student');
        await page.goto('/admin');
        await page.waitForURL(/\/(protected|student)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/admin');
    });

    test('student should NOT access /teacher pages', async ({ page }) => {
        await loginAs(page, 'student');
        await page.goto('/teacher');
        await page.waitForURL(/\/(protected|student)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/teacher');
    });

    // ─── Teacher Role ─────────────────────────────────────────────

    test('teacher should access /teacher pages', async ({ page }) => {
        await loginAs(page, 'teacher');
        await page.goto('/teacher');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/\/teacher/);
    });

    test('teacher should NOT access /admin pages', async ({ page }) => {
        await loginAs(page, 'teacher');
        await page.goto('/admin');
        await page.waitForURL(/\/(protected|teacher)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/admin');
    });

    // ─── Board Role ───────────────────────────────────────────────

    test('board should access /board pages', async ({ page }) => {
        await loginAs(page, 'board');
        await page.goto('/board');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/\/board/);
    });

    test('board should NOT access /admin pages', async ({ page }) => {
        await loginAs(page, 'board');
        await page.goto('/admin');
        await page.waitForURL(/\/(protected|board)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/admin');
    });

    // ─── Supervision Role ─────────────────────────────────────────

    test('supervision should access /supervision pages', async ({ page }) => {
        await loginAs(page, 'supervision');
        await page.goto('/supervision');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/\/supervision/);
    });

    test('supervision should NOT access /admin pages', async ({ page }) => {
        await loginAs(page, 'supervision');
        await page.goto('/admin');
        await page.waitForURL(/\/(protected|supervision)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/admin');
    });

    // ─── Departments Role ─────────────────────────────────────────

    test('departments should access /departments pages', async ({ page }) => {
        await loginAs(page, 'departments');
        await page.goto('/departments');
        await waitForPageReady(page);
        await expect(page).toHaveURL(/\/departments/);
    });

    test('departments should NOT access /admin pages', async ({ page }) => {
        await loginAs(page, 'departments');
        await page.goto('/admin');
        await page.waitForURL(/\/(protected|departments)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/admin');
    });
});
