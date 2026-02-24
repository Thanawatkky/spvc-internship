import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Change Password — เปลี่ยนรหัสผ่านครั้งแรก', () => {

    // หมายเหตุ: test นี้ต้องมี user ที่ is_first_login = true ใน database
    // ถ้าไม่มี ให้ skip หรือ seed data ก่อนรัน

    test.beforeEach(async ({ page }) => {
        // ต้องเข้าหน้า change-password ผ่าน middleware redirect
        // หรือเข้าตรง (ถ้า session ยังเป็น first_login)
        await page.goto('/change-password');
        await waitForPageReady(page);
    });

    // ─── UI Elements ───────────────────────────────────────────────

    test('should display change password form elements', async ({ page }) => {
        // ถ้า redirect ไป signin เพราะไม่ได้ login ให้ skip
        if (page.url().includes('/signin')) {
            test.skip();
            return;
        }

        // Title
        await expect(page.getByText('ยินดีต้อนรับเข้าสู่ระบบ')).toBeVisible();
        await expect(page.getByText('กรุณาเปลี่ยนรหัสผ่านของคุณเพื่อความปลอดภัย')).toBeVisible();

        // Alert box
        await expect(page.getByText('นี่คือการเข้าใช้งานครั้งแรกของคุณ')).toBeVisible();

        // New password field
        const newPasswordInput = page.locator('#newPassword');
        await expect(newPasswordInput).toBeVisible();

        // Confirm password field
        const confirmPasswordInput = page.locator('#confirmPassword');
        await expect(confirmPasswordInput).toBeVisible();

        // Submit button
        await expect(page.locator('button[type="submit"]')).toBeVisible();
        await expect(page.getByText('เปลี่ยนรหัสผ่าน')).toBeVisible();
    });

    // ─── Password Requirements Checklist ───────────────────────────

    test('should display password requirements checklist', async ({ page }) => {
        if (page.url().includes('/signin')) {
            test.skip();
            return;
        }

        await expect(page.getByText('รหัสผ่านต้องประกอบด้วย:')).toBeVisible();
        await expect(page.getByText('อย่างน้อย 8 ตัวอักษร')).toBeVisible();
        await expect(page.getByText('ตัวอักษรพิมพ์ใหญ่ (A-Z)')).toBeVisible();
        await expect(page.getByText('ตัวอักษรพิมพ์เล็ก (a-z)')).toBeVisible();
        await expect(page.getByText('ตัวเลข (0-9)')).toBeVisible();
    });

    // ─── Password Strength Indicator ──────────────────────────────

    test('should show password strength indicator as user types', async ({ page }) => {
        if (page.url().includes('/signin')) {
            test.skip();
            return;
        }

        const newPasswordInput = page.locator('#newPassword');

        // Weak password
        await newPasswordInput.fill('abc');
        await expect(page.getByText('อ่อน')).toBeVisible();

        // Medium password
        await newPasswordInput.fill('Abcdefgh');
        await expect(page.getByText('ปานกลาง')).toBeVisible();

        // Strong password
        await newPasswordInput.fill('Abcdefgh1!@#');
        await expect(page.getByText('แข็งแรง')).toBeVisible();
    });

    // ─── Password Mismatch ────────────────────────────────────────

    test('should show error when passwords do not match', async ({ page }) => {
        if (page.url().includes('/signin')) {
            test.skip();
            return;
        }

        await page.locator('#newPassword').fill('Abcd1234');
        await page.locator('#confirmPassword').fill('Abcd5678');

        await expect(page.getByText('รหัสผ่านไม่ตรงกัน')).toBeVisible();
    });

    // ─── Password Match ───────────────────────────────────────────

    test('should show success when passwords match', async ({ page }) => {
        if (page.url().includes('/signin')) {
            test.skip();
            return;
        }

        await page.locator('#newPassword').fill('Abcd1234');
        await page.locator('#confirmPassword').fill('Abcd1234');

        await expect(page.getByText('รหัสผ่านตรงกัน')).toBeVisible();
    });

    // ─── Submit Button Disabled ───────────────────────────────────

    test('should disable submit button when form is invalid', async ({ page }) => {
        if (page.url().includes('/signin')) {
            test.skip();
            return;
        }

        const submitBtn = page.locator('button[type="submit"]');

        // Empty fields → disabled
        await expect(submitBtn).toBeDisabled();

        // Only new password → still disabled
        await page.locator('#newPassword').fill('Abcd1234');
        await expect(submitBtn).toBeDisabled();

        // Mismatched passwords → still disabled
        await page.locator('#confirmPassword').fill('Abcd5678');
        await expect(submitBtn).toBeDisabled();

        // Matching passwords → enabled
        await page.locator('#confirmPassword').fill('Abcd1234');
        await expect(submitBtn).toBeEnabled();
    });

    // ─── Validation Errors ────────────────────────────────────────

    test('should show validation error for short password', async ({ page }) => {
        if (page.url().includes('/signin')) {
            test.skip();
            return;
        }

        await page.locator('#newPassword').fill('Ab1');
        await expect(page.getByText('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')).toBeVisible();
    });

    test('should show validation error for missing uppercase', async ({ page }) => {
        if (page.url().includes('/signin')) {
            test.skip();
            return;
        }

        await page.locator('#newPassword').fill('abcd1234');
        await expect(page.getByText('รหัสผ่านต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว')).toBeVisible();
    });
});
