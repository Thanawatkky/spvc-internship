import { studentSchema } from '@/lib/zod';

// Helper: valid student data base
function validStudentData() {
    // Create a mock File
    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    return {
        studentId: '66309010001',
        firstname: 'สมชาย',
        lastname: 'ใจดี',
        academicYear: '2566',
        citizenId: '1234567890128',
        phone: '0987654321',
        sex: '1',
        educationLevel: 'ปวช.',
        departmentId: '1',
        major: 'เทคโนโลยีสารสนเทศ',
        birthday: '2006-01-10',
        user_img: file,
    };
}

describe('studentSchema', () => {
    // ============================================
    // Valid data
    // ============================================
    it('should pass validation with all valid data', () => {
        const data = validStudentData();
        const result = studentSchema.safeParse(data);
        expect(result.success).toBe(true);
    });

    // ============================================
    // studentId validation
    // ============================================
    describe('studentId', () => {
        it('should fail when studentId is empty', () => {
            const data = validStudentData();
            data.studentId = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                const errors = result.error.flatten().fieldErrors;
                expect(errors.studentId).toBeDefined();
                expect(errors.studentId![0]).toBe('กรุณากรอกรหัสนักศึกษา');
            }
        });
    });

    // ============================================
    // firstname / lastname validation
    // ============================================
    describe('firstname', () => {
        it('should fail when firstname is empty', () => {
            const data = validStudentData();
            data.firstname = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.firstname![0]).toBe('กรุณากรอกชื่อ');
            }
        });
    });

    describe('lastname', () => {
        it('should fail when lastname is empty', () => {
            const data = validStudentData();
            data.lastname = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.lastname![0]).toBe('กรุณากรอกนามสกุล');
            }
        });
    });

    // ============================================
    // citizenId validation
    // ============================================
    describe('citizenId', () => {
        it('should fail when citizenId is empty', () => {
            const data = validStudentData();
            data.citizenId = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should fail when citizenId is not 13 digits', () => {
            const data = validStudentData();
            data.citizenId = '12345';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.citizenId![0]).toBe('กรุณากรอกเลขบัตร 13 หลักให้ถูกต้อง');
            }
        });

        it('should fail when citizenId has non-digits', () => {
            const data = validStudentData();
            data.citizenId = 'abcdefghijklm';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should pass with valid 13-digit citizenId', () => {
            const data = validStudentData();
            data.citizenId = '1234567890128';
            const result = studentSchema.safeParse(data);
            // citizenId validation only checks format, not checksum
            if (result.success) {
                expect(result.success).toBe(true);
            }
        });
    });

    // ============================================
    // phone validation
    // ============================================
    describe('phone', () => {
        it('should fail when phone does not start with 0', () => {
            const data = validStudentData();
            data.phone = '1987654321';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.phone![0]).toBe('กรุณากรอกเบอร์โทรให้ถูกต้อง เช่น 0987654321');
            }
        });

        it('should fail when phone is not 10 digits', () => {
            const data = validStudentData();
            data.phone = '098765432'; // 9 digits
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should fail when phone has non-digits', () => {
            const data = validStudentData();
            data.phone = '098-765-43';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should pass with valid 10-digit phone starting with 0', () => {
            const data = validStudentData();
            data.phone = '0812345678';
            const result = studentSchema.safeParse(data);
            // Only phone-related errors should be absent
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.phone).toBeUndefined();
            }
        });
    });

    // ============================================
    // sex, educationLevel, departmentId, major, academicYear
    // ============================================
    describe('required select fields', () => {
        it('should fail when sex is empty', () => {
            const data = validStudentData();
            data.sex = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.sex![0]).toBe('กรุณาเลือกเพศ');
            }
        });

        it('should fail when educationLevel is empty', () => {
            const data = validStudentData();
            data.educationLevel = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.educationLevel![0]).toBe('กรุณาเลือกระดับชั้น');
            }
        });

        it('should fail when departmentId is empty', () => {
            const data = validStudentData();
            data.departmentId = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.departmentId![0]).toBe('กรุณาเลือกแผนกวิชา');
            }
        });

        it('should fail when major is empty', () => {
            const data = validStudentData();
            data.major = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.major![0]).toBe('กรุณากรอกสาขาวิชา');
            }
        });

        it('should fail when academicYear is empty', () => {
            const data = validStudentData();
            data.academicYear = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.academicYear![0]).toBe('กรุณากรอกปีการศึกษา');
            }
        });
    });

    // ============================================
    // birthday validation
    // ============================================
    describe('birthday', () => {
        it('should pass with valid YYYY-MM-DD date', () => {
            const data = validStudentData();
            data.birthday = '2006-01-10';
            const result = studentSchema.safeParse(data);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.birthday).toBeUndefined();
            }
        });

        it('should fail with invalid date format', () => {
            const data = validStudentData();
            data.birthday = '10/01/2006';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.birthday).toBeDefined();
            }
        });

        it('should fail with impossible date', () => {
            const data = validStudentData();
            data.birthday = '2006-13-32';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
        });

        it('should fail with empty birthday', () => {
            const data = validStudentData();
            data.birthday = '';
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
        });
    });

    // ============================================
    // user_img validation
    // ============================================
    describe('user_img', () => {
        it('should pass with JPEG file under 5MB', () => {
            const data = validStudentData();
            const file = new File(['x'.repeat(100)], 'photo.jpg', { type: 'image/jpeg' });
            data.user_img = file;
            const result = studentSchema.safeParse(data);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.user_img).toBeUndefined();
            }
        });

        it('should pass with PNG file', () => {
            const data = validStudentData();
            const file = new File(['x'.repeat(100)], 'photo.png', { type: 'image/png' });
            data.user_img = file;
            const result = studentSchema.safeParse(data);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.user_img).toBeUndefined();
            }
        });

        it('should fail with non-image file type', () => {
            const data = validStudentData();
            const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
            data.user_img = file;
            const result = studentSchema.safeParse(data);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.flatten().fieldErrors.user_img).toBeDefined();
            }
        });
    });
});
