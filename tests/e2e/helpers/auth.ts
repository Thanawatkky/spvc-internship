import { type Page, expect } from '@playwright/test';

/**
 * Test user credentials for each role
 * ⚠️ สำคัญ: ต้องแก้ไข username/password ให้ตรงกับ data ใน database จริง
 */
export const TEST_USERS = {
    admin: { username: 'admin', password: 'Admin@1234', role: 1, redirectPath: '/admin' },
    board: { username: 'board', password: 'Board@1234', role: 2, redirectPath: '/board' },
    departments: { username: 'departments', password: 'Dept@1234', role: 3, redirectPath: '/departments' },
    teacher: { username: 'teacher', password: 'Teacher@1234', role: 4, redirectPath: '/teacher' },
    supervision: { username: 'supervision', password: 'Super@1234', role: 5, redirectPath: '/supervision' },
    student: { username: 'student', password: 'Student@1234', role: 7, redirectPath: '/student' },
} as const;

export type RoleName = keyof typeof TEST_USERS;

/**
 * Login as a specific role
 */
export async function loginAs(page: Page, role: RoleName): Promise<void> {
    const user = TEST_USERS[role];

    await page.goto('/signin');
    await page.waitForLoadState('networkidle');

    // Fill in login form
    await page.locator('#username').fill(user.username);
    await page.locator('#userpwd').fill(user.password);

    // Submit
    await page.locator('button[type="submit"]').click();

    // Wait for redirect to role-specific page
    await page.waitForURL(`**${user.redirectPath}**`, { timeout: 15000 });
}

/**
 * Assert current URL contains expected path
 */
export async function expectPathContains(page: Page, path: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(path.replace(/\//g, '\\/')));
}

/**
 * Wait for page to fully load (including client-side hydration)
 */
export async function waitForPageReady(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
    // Wait a bit for React hydration
    await page.waitForTimeout(1000);
}

/**
 * Dismiss any SweetAlert2 dialogs if present
 */
export async function dismissSwalIfPresent(page: Page): Promise<void> {
    const swalConfirm = page.locator('.swal2-confirm');
    if (await swalConfirm.isVisible({ timeout: 2000 }).catch(() => false)) {
        await swalConfirm.click();
    }
}
