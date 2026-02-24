/**
 * Form Validation Tests
 *
 * ทดสอบ validation logic ที่แยกออกมาจาก formTeacher.tsx และ formStudent.tsx
 * เนื่องจาก validate functions อยู่ใน component (ใช้ useState) จึง extract logic ออกมาทดสอบแยก
 */

// ============================================
// Teacher form validation logic (extracted)
// ============================================
interface TeacherFormData {
    citizenId: string;
    firstname: string;
    lastname: string;
    phone: string;
    sex: string;
    role: number;
    birthday: string;
    departmentId: string;
    majorId: string;
    educationId: string;
    term: string;
    grade: string;
}

function validateTeacher(formData: TeacherFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.citizenId) {
        errors.citizenId = "กรุณากรอกเลขบัตรประชาชน";
        isValid = false;
    } else if (!/^\d{13}$/.test(formData.citizenId)) {
        errors.citizenId = "กรุณากรอกเลขบัตร 13 หลักให้ถูกต้อง";
        isValid = false;
    }

    if (!formData.firstname) {
        errors.firstname = "กรุณากรอกชื่อ";
        isValid = false;
    }

    if (!formData.lastname) {
        errors.lastname = "กรุณากรอกนามสกุล";
        isValid = false;
    }

    if (!formData.phone) {
        errors.phone = "กรุณากรอกเบอร์โทร";
        isValid = false;
    } else if (!/^0\d{9}$/.test(formData.phone)) {
        errors.phone = "กรุณากรอกเบอร์โทรให้ถูกต้อง เช่น 0987654321";
        isValid = false;
    }

    if (!formData.sex) {
        errors.sex = "กรุณาเลือกเพศ";
        isValid = false;
    }

    if (!formData.birthday) {
        errors.birthdate = "กรุณาเลือกวันเกิด";
        isValid = false;
    }

    // departmentId required for non-admin roles
    if (formData.role !== 2 && !formData.departmentId) {
        errors.departmentId = "กรุณาเลือกแผนกวิชา";
        isValid = false;
    }

    if (formData.role !== 2 && !formData.majorId) {
        errors.majorId = "กรุณาเลือกสาขาวิชา";
        isValid = false;
    }

    if (!formData.educationId) {
        errors.educationId = "กรุณาเลือกระดับการศึกษา";
        isValid = false;
    }

    if (!formData.term) {
        errors.term = "กรุณาเลือกภาคเรียน";
        isValid = false;
    }

    if (!formData.grade) {
        errors.grade = "กรุณาเลือกระดับชั้น";
        isValid = false;
    }

    return { isValid, errors };
}

// ============================================
// Student form validation logic (extracted)
// ============================================
interface StudentFormData {
    studentId: string;
    citizenId: string;
    firstname: string;
    lastname: string;
    phone: string;
    sex: string;
    birthday: string;
    educationLevel: string;
    department: string;
    major_id: string;
    academicYear: string;
    room: string;
    term: string;
    gradeLevel: string;
}

function validateStudent(formData: StudentFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.studentId) {
        errors.studentId = "กรุณากรอกรหัสนักศึกษา";
        isValid = false;
    }

    if (!formData.citizenId) {
        errors.citizenId = "กรุณากรอกเลขบัตรประชาชน";
        isValid = false;
    } else if (!/^\d{13}$/.test(formData.citizenId)) {
        errors.citizenId = "กรุณากรอกเลขบัตร 13 หลักให้ถูกต้อง";
        isValid = false;
    }

    if (!formData.firstname) {
        errors.firstname = "กรุณากรอกชื่อ";
        isValid = false;
    }

    if (!formData.lastname) {
        errors.lastname = "กรุณากรอกนามสกุล";
        isValid = false;
    }

    if (!formData.phone) {
        errors.phone = "กรุณากรอกเบอร์โทร";
        isValid = false;
    } else if (!/^0\d{9}$/.test(formData.phone)) {
        errors.phone = "กรุณากรอกเบอร์โทรให้ถูกต้อง เช่น 0987654321";
        isValid = false;
    }

    if (!formData.sex) {
        errors.sex = "กรุณาเลือกเพศ";
        isValid = false;
    }

    if (!formData.birthday) {
        errors.birthday = "กรุณากรอกวันเกิด";
        isValid = false;
    }

    if (!formData.educationLevel) {
        errors.educationLevel = "กรุณาเลือกระดับชั้น";
        isValid = false;
    }

    if (!formData.department) {
        errors.department = "กรุณาเลือกแผนกวิชา";
        isValid = false;
    }

    if (!formData.major_id) {
        errors.major_id = "กรุณาเลือกสาขาวิชา";
        isValid = false;
    }

    if (!formData.academicYear) {
        errors.academicYear = "กรุณากรอกปีการศึกษา";
        isValid = false;
    }

    if (!formData.room) {
        errors.room = "กรุณากรอกห้องเรียน";
        isValid = false;
    }

    if (!formData.term) {
        errors.term = "กรุณาเลือกภาคเรียน";
        isValid = false;
    }

    if (!formData.gradeLevel) {
        errors.gradeLevel = "กรุณาเลือกระดับชั้น";
        isValid = false;
    }

    return { isValid, errors };
}

// ============================================
// Teacher validation tests
// ============================================
describe('Teacher form validation', () => {
    const validTeacher: TeacherFormData = {
        citizenId: '1234567890128',
        firstname: 'สมชาย',
        lastname: 'รักเรียน',
        phone: '0812345678',
        sex: '1',
        role: 3,
        birthday: '1990-01-15',
        departmentId: '1',
        majorId: '1',
        educationId: '1',
        term: '1',
        grade: '1',
    };

    it('should pass with all valid data', () => {
        const { isValid, errors } = validateTeacher(validTeacher);
        expect(isValid).toBe(true);
        expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should fail when citizenId is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, citizenId: '' });
        expect(isValid).toBe(false);
        expect(errors.citizenId).toBe('กรุณากรอกเลขบัตรประชาชน');
    });

    it('should fail when citizenId is not 13 digits', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, citizenId: '12345' });
        expect(isValid).toBe(false);
        expect(errors.citizenId).toBe('กรุณากรอกเลขบัตร 13 หลักให้ถูกต้อง');
    });

    it('should fail when firstname is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, firstname: '' });
        expect(isValid).toBe(false);
        expect(errors.firstname).toBe('กรุณากรอกชื่อ');
    });

    it('should fail when lastname is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, lastname: '' });
        expect(isValid).toBe(false);
        expect(errors.lastname).toBe('กรุณากรอกนามสกุล');
    });

    it('should fail when phone is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, phone: '' });
        expect(isValid).toBe(false);
        expect(errors.phone).toBe('กรุณากรอกเบอร์โทร');
    });

    it('should fail when phone format is invalid', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, phone: '1234567890' });
        expect(isValid).toBe(false);
        expect(errors.phone).toBe('กรุณากรอกเบอร์โทรให้ถูกต้อง เช่น 0987654321');
    });

    it('should fail when sex is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, sex: '' });
        expect(isValid).toBe(false);
        expect(errors.sex).toBe('กรุณาเลือกเพศ');
    });

    it('should fail when birthday is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, birthday: '' });
        expect(isValid).toBe(false);
        expect(errors.birthdate).toBe('กรุณาเลือกวันเกิด');
    });

    // Role-specific tests
    describe('role-based department/major validation', () => {
        it('should fail when departmentId is empty for non-admin role (role 3)', () => {
            const { isValid, errors } = validateTeacher({ ...validTeacher, role: 3, departmentId: '' });
            expect(isValid).toBe(false);
            expect(errors.departmentId).toBe('กรุณาเลือกแผนกวิชา');
        });

        it('should NOT require departmentId for admin role (role 2)', () => {
            const { errors } = validateTeacher({ ...validTeacher, role: 2, departmentId: '', majorId: '' });
            expect(errors.departmentId).toBeUndefined();
            expect(errors.majorId).toBeUndefined();
        });

        it('should fail when majorId is empty for non-admin role', () => {
            const { isValid, errors } = validateTeacher({ ...validTeacher, role: 4, majorId: '' });
            expect(isValid).toBe(false);
            expect(errors.majorId).toBe('กรุณาเลือกสาขาวิชา');
        });
    });

    it('should fail when educationId is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, educationId: '' });
        expect(isValid).toBe(false);
        expect(errors.educationId).toBe('กรุณาเลือกระดับการศึกษา');
    });

    it('should fail when term is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, term: '' });
        expect(isValid).toBe(false);
        expect(errors.term).toBe('กรุณาเลือกภาคเรียน');
    });

    it('should fail when grade is empty', () => {
        const { isValid, errors } = validateTeacher({ ...validTeacher, grade: '' });
        expect(isValid).toBe(false);
        expect(errors.grade).toBe('กรุณาเลือกระดับชั้น');
    });

    it('should return multiple errors when multiple fields are missing', () => {
        const { isValid, errors } = validateTeacher({
            ...validTeacher,
            firstname: '',
            lastname: '',
            phone: '',
        });
        expect(isValid).toBe(false);
        expect(errors.firstname).toBeDefined();
        expect(errors.lastname).toBeDefined();
        expect(errors.phone).toBeDefined();
    });
});

// ============================================
// Student validation tests
// ============================================
describe('Student form validation', () => {
    const validStudent: StudentFormData = {
        studentId: '66309010001',
        citizenId: '1234567890128',
        firstname: 'สมหญิง',
        lastname: 'ตั้งใจ',
        phone: '0987654321',
        sex: '2',
        birthday: '2006-01-10',
        educationLevel: '1',
        department: '1',
        major_id: '1',
        academicYear: '2566',
        room: '1',
        term: '1',
        gradeLevel: '1',
    };

    it('should pass with all valid data', () => {
        const { isValid, errors } = validateStudent(validStudent);
        expect(isValid).toBe(true);
        expect(Object.keys(errors)).toHaveLength(0);
    });

    it('should fail when studentId is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, studentId: '' });
        expect(isValid).toBe(false);
        expect(errors.studentId).toBe('กรุณากรอกรหัสนักศึกษา');
    });

    it('should fail when citizenId is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, citizenId: '' });
        expect(isValid).toBe(false);
        expect(errors.citizenId).toBe('กรุณากรอกเลขบัตรประชาชน');
    });

    it('should fail when citizenId format is wrong', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, citizenId: '12345' });
        expect(isValid).toBe(false);
        expect(errors.citizenId).toBe('กรุณากรอกเลขบัตร 13 หลักให้ถูกต้อง');
    });

    it('should fail when firstname is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, firstname: '' });
        expect(isValid).toBe(false);
        expect(errors.firstname).toBe('กรุณากรอกชื่อ');
    });

    it('should fail when lastname is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, lastname: '' });
        expect(isValid).toBe(false);
        expect(errors.lastname).toBe('กรุณากรอกนามสกุล');
    });

    it('should fail when phone is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, phone: '' });
        expect(isValid).toBe(false);
        expect(errors.phone).toBe('กรุณากรอกเบอร์โทร');
    });

    it('should fail when phone does not start with 0', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, phone: '1234567890' });
        expect(isValid).toBe(false);
        expect(errors.phone).toBe('กรุณากรอกเบอร์โทรให้ถูกต้อง เช่น 0987654321');
    });

    it('should fail when sex is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, sex: '' });
        expect(isValid).toBe(false);
        expect(errors.sex).toBe('กรุณาเลือกเพศ');
    });

    it('should fail when birthday is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, birthday: '' });
        expect(isValid).toBe(false);
        expect(errors.birthday).toBe('กรุณากรอกวันเกิด');
    });

    it('should fail when educationLevel is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, educationLevel: '' });
        expect(isValid).toBe(false);
        expect(errors.educationLevel).toBe('กรุณาเลือกระดับชั้น');
    });

    it('should fail when department is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, department: '' });
        expect(isValid).toBe(false);
        expect(errors.department).toBe('กรุณาเลือกแผนกวิชา');
    });

    it('should fail when major_id is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, major_id: '' });
        expect(isValid).toBe(false);
        expect(errors.major_id).toBe('กรุณาเลือกสาขาวิชา');
    });

    it('should fail when academicYear is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, academicYear: '' });
        expect(isValid).toBe(false);
        expect(errors.academicYear).toBe('กรุณากรอกปีการศึกษา');
    });

    it('should fail when room is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, room: '' });
        expect(isValid).toBe(false);
        expect(errors.room).toBe('กรุณากรอกห้องเรียน');
    });

    it('should fail when term is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, term: '' });
        expect(isValid).toBe(false);
        expect(errors.term).toBe('กรุณาเลือกภาคเรียน');
    });

    it('should fail when gradeLevel is empty', () => {
        const { isValid, errors } = validateStudent({ ...validStudent, gradeLevel: '' });
        expect(isValid).toBe(false);
        expect(errors.gradeLevel).toBe('กรุณาเลือกระดับชั้น');
    });

    it('should return all errors when all fields are empty', () => {
        const emptyData: StudentFormData = {
            studentId: '',
            citizenId: '',
            firstname: '',
            lastname: '',
            phone: '',
            sex: '',
            birthday: '',
            educationLevel: '',
            department: '',
            major_id: '',
            academicYear: '',
            room: '',
            term: '',
            gradeLevel: '',
        };
        const { isValid, errors } = validateStudent(emptyData);
        expect(isValid).toBe(false);
        expect(Object.keys(errors).length).toBeGreaterThanOrEqual(14);
    });
});
