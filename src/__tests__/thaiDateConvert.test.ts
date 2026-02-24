import { formatThaiDateFixed } from '@/lib/thaiDateConvert';

describe('formatThaiDateFixed', () => {
    // ============================================
    // Date object inputs
    // ============================================
    describe('Date object input', () => {
        it('should format a Date object to dd/mm/Buddhist year', () => {
            // new Date(2023, 0, 15) = January 15, 2023 → 15/01/2566
            const date = new Date(Date.UTC(2023, 0, 15));
            expect(formatThaiDateFixed(date)).toBe('15/01/2566');
        });

        it('should handle December correctly', () => {
            const date = new Date(Date.UTC(2023, 11, 25));
            expect(formatThaiDateFixed(date)).toBe('25/12/2566');
        });

        it('should zero-pad single digit day and month', () => {
            const date = new Date(Date.UTC(2000, 2, 5)); // March 5
            expect(formatThaiDateFixed(date)).toBe('05/03/2543');
        });
    });

    // ============================================
    // String "dd/mm/yyyy" (Thai date format) inputs
    // ============================================
    describe('string dd/mm/yyyy input', () => {
        it('should convert dd/mm/yyyy string with BE year > 2500', () => {
            // 01/01/2555 (BE) → convert to CE: 2555 - 543 = 2012 → output: 01/01/2555
            expect(formatThaiDateFixed('01/01/2555')).toBe('01/01/2555');
        });

        it('should convert dd/mm/yyyy string with CE year <= 2500', () => {
            // 15/06/2023 (CE) → keep as CE → output: 15/06/2566 (2023 + 543)
            expect(formatThaiDateFixed('15/06/2023')).toBe('15/06/2566');
        });

        it('should handle end of year dates', () => {
            expect(formatThaiDateFixed('31/12/2024')).toBe('31/12/2567');
        });
    });

    // ============================================
    // ISO string inputs
    // ============================================
    describe('ISO string input', () => {
        it('should format ISO date string', () => {
            expect(formatThaiDateFixed('2023-01-10')).toBe('10/01/2566');
        });

        it('should format ISO date-time string', () => {
            expect(formatThaiDateFixed('2024-06-15T00:00:00.000Z')).toBe('15/06/2567');
        });
    });

    // ============================================
    // Invalid inputs
    // ============================================
    describe('invalid inputs', () => {
        it('should return "Invalid date" for empty string', () => {
            expect(formatThaiDateFixed('')).toBe('Invalid date');
        });

        it('should return "Invalid date" for garbage string', () => {
            expect(formatThaiDateFixed('not-a-date')).toBe('Invalid date');
        });

        it('should return "Invalid date" for random text', () => {
            expect(formatThaiDateFixed('hello world')).toBe('Invalid date');
        });
    });
});
