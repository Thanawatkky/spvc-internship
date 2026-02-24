import { test, expect } from '@playwright/test';
import { loginAs, TEST_USERS, waitForPageReady } from '../helpers/auth';

test.describe('Login Page — หน้าเข้าสู่ระบบ', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/signin');
        await waitForPageReady(page);
    });

    // ─── UI Elements ───────────────────────────────────────────────

    test('should display login form with all required elements', async ({ page }) => {
        // Title
        await expect(page.getByText('ยินดีต้อนรับสู่ ระบบรายงานการฝึกงาน')).toBeVisible();
        await expect(page.getByText('วิทยาลัยอาชีวะศึกษาสุพรรณบุรี')).toBeVisible();

        // Username field
        const usernameInput = page.locator('#username');
        await expect(usernameInput).toBeVisible();
        await expect(usernameInput).toHaveAttribute('placeholder', 'กรุณากรอกรหัสนักศึกษาของคุณ');

        // Password field
        const passwordInput = page.locator('#userpwd');
        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Submit button
        const submitBtn = page.locator('button[type="submit"]');
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toContainText('เข้าสู่ระบบ');
    });

    // ─── Password Toggle ──────────────────────────────────────────

    test('should toggle password visibility', async ({ page }) => {
        const passwordInput = page.locator('#userpwd');
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Click eye icon to show password
        const toggleBtn = page.locator('#userpwd').locator('..').locator('span');
        await toggleBtn.click();
        await expect(passwordInput).toHaveAttribute('type', 'text');

        // Click again to hide
        await toggleBtn.click();
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    // ─── Successful Login (per role) ──────────────────────────────

    test('should login as admin and redirect to /admin', async ({ page }) => {
        await loginAs(page, 'admin');
        await expect(page).toHaveURL(/\/admin/);
    });

    test('should login as student and redirect to /student', async ({ page }) => {
        await loginAs(page, 'student');
        await expect(page).toHaveURL(/\/student/);
    });

    test('should login as teacher and redirect to /teacher', async ({ page }) => {
        await loginAs(page, 'teacher');
        await expect(page).toHaveURL(/\/teacher/);
    });

    test('should login as board and redirect to /board', async ({ page }) => {
        await loginAs(page, 'board');
        await expect(page).toHaveURL(/\/board/);
    });

    test('should login as supervision and redirect to /supervision', async ({ page }) => {
        await loginAs(page, 'supervision');
        await expect(page).toHaveURL(/\/supervision/);
    });

    test('should login as departments and redirect to /departments', async ({ page }) => {
        await loginAs(page, 'departments');
        await expect(page).toHaveURL(/\/departments/);
    });

    // ─── Failed Login ─────────────────────────────────────────────

    test('should show error toast on invalid credentials', async ({ page }) => {
        await page.locator('#username').fill('invalid_user');
        await page.locator('#userpwd').fill('wrong_password');
        await page.locator('button[type="submit"]').click();

        // SweetAlert2 error toast
        await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 10000 });
    });

    // ─── Redirect if already logged in ───────────────────────────

    test('should redirect logged-in user away from signin page', async ({ page }) => {
        // Login first
        await loginAs(page, 'admin');

        // Try to visit signin
        await page.goto('/signin');
        await page.waitForURL(/\/admin/, { timeout: 10000 });
        await expect(page).toHaveURL(/\/admin/);
    });
});

test.describe('Unauthenticated Access — เข้าถึงโดยไม่ login', () => {

    test('should redirect to /signin when accessing protected pages without login', async ({ page }) => {
        await page.goto('/admin');
        await page.waitForURL(/\/signin/, { timeout: 10000 });
        await expect(page).toHaveURL(/\/signin/);
    });

    test('should redirect to /signin when accessing /student without login', async ({ page }) => {
        await page.goto('/student');
        await page.waitForURL(/\/signin/, { timeout: 10000 });
        await expect(page).toHaveURL(/\/signin/);
    });
});
