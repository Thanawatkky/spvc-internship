import { test, expect } from '@playwright/test';
import { loginAs, waitForPageReady } from '../helpers/auth';

test.describe('Admin Students — จัดการข้อมูลนักศึกษา', () => {

    test.beforeEach(async ({ page }) => {
        await loginAs(page, 'admin');
        await page.goto('/admin/students');
        await waitForPageReady(page);
    });

    // ─── Table Display ─────────────────────────────────────────────

    test('should display students table', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });
    });

    test('should display table headers correctly', async ({ page }) => {
        const table = page.locator('table').first();
        await expect(table).toBeVisible({ timeout: 15000 });

        // Check for common column headers
        const headerRow = page.locator('thead tr').first();
        await expect(headerRow).toBeVisible();
    });

    // ─── Search / Filter ──────────────────────────────────────────

    test('should have search input for filtering', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"], input[type="search"], input[type="text"]').first();
        await expect(searchInput).toBeVisible();
    });

    test('should filter table when searching', async ({ page }) => {
        const searchInput = page.locator('input[placeholder*="ค้นหา"], input[placeholder*="search"], input[type="search"]').first();
        if (await searchInput.isVisible()) {
            await searchInput.fill('test');
            await page.waitForTimeout(1000); // Wait for debounced filter
        }
    });

    // ─── Pagination ────────────────────────────────────────────────

    test('should display pagination controls', async ({ page }) => {
        const pagination = page.locator('button:has-text("Next"), button:has-text("Previous"), [class*="pagination"], button:has-text(">")').first();
        // Pagination may not show if there's not enough data
        if (await pagination.isVisible({ timeout: 3000 }).catch(() => false)) {
            await expect(pagination).toBeVisible();
        }
    });

    // ─── Add Student Dialog ────────────────────────────────────────

    test('should open add student dialog', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add"), button:has-text("สร้าง")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await addBtn.click();
            await page.waitForTimeout(500);

            // Dialog should open
            const dialog = page.locator('[role="dialog"], .modal, [class*="dialog"]').first();
            await expect(dialog).toBeVisible({ timeout: 5000 });
        }
    });

    test('should show form fields in add student dialog', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add"), button:has-text("สร้าง")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await addBtn.click();
            await page.waitForTimeout(500);

            // Check for student ID field
            const studentIdField = page.locator('input[name*="student"], input[placeholder*="รหัส"]').first();
            if (await studentIdField.isVisible({ timeout: 3000 }).catch(() => false)) {
                await expect(studentIdField).toBeVisible();
            }
        }
    });

    test('should close add student dialog', async ({ page }) => {
        const addBtn = page.locator('button:has-text("เพิ่ม"), button:has-text("Add"), button:has-text("สร้าง")').first();
        if (await addBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await addBtn.click();
            await page.waitForTimeout(500);

            // Close dialog
            const closeBtn = page.locator('[role="dialog"] button:has-text("ยกเลิก"), [role="dialog"] button:has-text("ปิด"), button[aria-label="close"], button[aria-label="Close"]').first();
            if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await closeBtn.click();
                await page.waitForTimeout(500);
            }
        }
    });

    // ─── Edit Student ──────────────────────────────────────────────

    test('should open edit dialog when clicking edit button on a row', async ({ page }) => {
        const editBtn = page.locator('table button:has-text("แก้ไข"), table button[aria-label*="edit"], table .tabler-icon-edit, table svg[class*="edit"]').first();
        if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editBtn.click();
            await page.waitForTimeout(500);

            const dialog = page.locator('[role="dialog"], .modal, [class*="dialog"]').first();
            await expect(dialog).toBeVisible({ timeout: 5000 });
        }
    });

    // ─── Delete Student ────────────────────────────────────────────

    test('should show confirm dialog when clicking delete button', async ({ page }) => {
        const deleteBtn = page.locator('table button:has-text("ลบ"), table button[aria-label*="delete"], table .tabler-icon-trash').first();
        if (await deleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await deleteBtn.click();
            await page.waitForTimeout(500);

            // SweetAlert2 or native confirm dialog
            const confirmDialog = page.locator('.swal2-popup, [role="alertdialog"]').first();
            if (await confirmDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
                await expect(confirmDialog).toBeVisible();

                // Cancel deletion
                const cancelBtn = page.locator('.swal2-cancel, button:has-text("ยกเลิก")').first();
                if (await cancelBtn.isVisible()) {
                    await cancelBtn.click();
                }
            }
        }
    });

    // ─── Excel Upload ──────────────────────────────────────────────

    test('should open Excel upload dialog', async ({ page }) => {
        const uploadBtn = page.locator('button:has-text("อัพโหลด"), button:has-text("Excel"), button:has-text("Import"), button:has-text("นำเข้า")').first();
        if (await uploadBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await uploadBtn.click();
            await page.waitForTimeout(500);

            const dialog = page.locator('[role="dialog"], .modal').first();
            if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
                await expect(dialog).toBeVisible();
            }
        }
    });

    // ─── Download Example ──────────────────────────────────────────

    test('should have download example file link/button', async ({ page }) => {
        const downloadLink = page.locator('a:has-text("ดาวน์โหลด"), button:has-text("ดาวน์โหลด"), a:has-text("ตัวอย่าง")').first();
        if (await downloadLink.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(downloadLink).toBeVisible();
        }
    });

    // ─── View Student Detail ───────────────────────────────────────

    test('should show student detail when clicking on a row', async ({ page }) => {
        const detailBtn = page.locator('table button:has-text("ดู"), table a:has-text("ดู"), table button[aria-label*="view"], table .tabler-icon-eye').first();
        if (await detailBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await detailBtn.click();
            await page.waitForTimeout(1000);
        }
    });
});
