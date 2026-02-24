import { userRole, userSex, maskCitizenId, excelSerialToDate, formatThaiDate, convertThaiDateToEnglishFormat } from '@/lib/utils';

// ============================================
// userRole()
// ============================================
describe('userRole', () => {
    it('should return "ผู้ดูแลระบบ" for role 1', () => {
        expect(userRole(1)).toBe('ผู้ดูแลระบบ');
    });

    it('should return "ผู้บริหาร" for role 2', () => {
        expect(userRole(2)).toBe('ผู้บริหาร');
    });

    it('should return "หัวหน้าแผนก" for role 3', () => {
        expect(userRole(3)).toBe('หัวหน้าแผนก');
    });

    it('should return "ครูที่ปรึกษา" for role 4', () => {
        expect(userRole(4)).toBe('ครูที่ปรึกษา');
    });

    it('should return "ครูทวิภาคี" for role 5', () => {
        expect(userRole(5)).toBe('ครูทวิภาคี');
    });

    it('should return "นักศึกษา" for unknown role (default)', () => {
        expect(userRole(7)).toBe('นักศึกษา');
        expect(userRole(0)).toBe('นักศึกษา');
        expect(userRole(99)).toBe('นักศึกษา');
    });
});

// ============================================
// userSex()
// ============================================
describe('userSex', () => {
    it('should return "ชาย" for sex 1', () => {
        expect(userSex(1)).toBe('ชาย');
    });

    it('should return "หญิง" for sex 2', () => {
        expect(userSex(2)).toBe('หญิง');
    });

    it('should return undefined for unknown sex', () => {
        expect(userSex(0)).toBeUndefined();
        expect(userSex(3)).toBeUndefined();
    });
});

// ============================================
// maskCitizenId()
// ============================================
describe('maskCitizenId', () => {
    it('should mask first 9 digits of a 13-digit ID', () => {
        expect(maskCitizenId('1234567890123')).toBe('******0123');
    });

    it('should mask correctly with all zeros', () => {
        expect(maskCitizenId('0000000000000')).toBe('******0000');
    });

    it('should return original string if length is not 13', () => {
        expect(maskCitizenId('12345')).toBe('12345');
        expect(maskCitizenId('')).toBe('');
        expect(maskCitizenId('12345678901234')).toBe('12345678901234');
    });
});

// ============================================
// excelSerialToDate()
// ============================================
describe('excelSerialToDate', () => {
    it('should convert Excel serial 1 to 1899-12-31', () => {
        const result = excelSerialToDate(1);
        expect(result.getFullYear()).toBe(1899);
        expect(result.getMonth()).toBe(11); // December
        expect(result.getDate()).toBe(31);
    });

    it('should convert Excel serial 44927 to 2023-01-01', () => {
        // 44927 is Excel serial for 2023-01-01
        const result = excelSerialToDate(44927);
        expect(result.getFullYear()).toBe(2023);
        expect(result.getMonth()).toBe(0); // January
        expect(result.getDate()).toBe(1);
    });

    it('should convert Excel serial 45658 to 2025-01-01', () => {
        const result = excelSerialToDate(45658);
        expect(result.getFullYear()).toBe(2025);
        expect(result.getMonth()).toBe(0);
        expect(result.getDate()).toBe(1);
    });
});

// ============================================
// formatThaiDate()
// ============================================
describe('formatThaiDate', () => {
    it('should format ISO date string to dd/mm/Buddhist year', () => {
        // 2006-01-10 → 10/01/2549
        const result = formatThaiDate('2006-01-10');
        expect(result).toBe('10/01/2549');
    });

    it('should zero-pad single-digit day and month', () => {
        const result = formatThaiDate('2000-03-05');
        expect(result).toBe('05/03/2543');
    });

    it('should handle December correctly', () => {
        const result = formatThaiDate('2023-12-25');
        expect(result).toBe('25/12/2566');
    });

    it('should handle January correctly (month + 1)', () => {
        const result = formatThaiDate('2024-01-01');
        expect(result).toBe('01/01/2567');
    });
});

// ============================================
// convertThaiDateToEnglishFormat()
// ============================================
describe('convertThaiDateToEnglishFormat', () => {
    it('should convert Thai full date to English format', () => {
        // "10 มกราคม 2549" → "January 10, 2006"
        const result = convertThaiDateToEnglishFormat('10 มกราคม 2549');
        expect(result).toBe('January 10, 2006');
    });

    it('should convert กุมภาพันธ์ correctly', () => {
        const result = convertThaiDateToEnglishFormat('14 กุมภาพันธ์ 2567');
        expect(result).toBe('February 14, 2024');
    });

    it('should convert ธันวาคม correctly', () => {
        const result = convertThaiDateToEnglishFormat('25 ธันวาคม 2566');
        expect(result).toBe('December 25, 2023');
    });

    it('should convert มิถุนายน correctly', () => {
        const result = convertThaiDateToEnglishFormat('1 มิถุนายน 2543');
        expect(result).toBe('June 1, 2000');
    });

    it('should convert พฤศจิกายน correctly', () => {
        const result = convertThaiDateToEnglishFormat('15 พฤศจิกายน 2568');
        expect(result).toBe('November 15, 2025');
    });
});
