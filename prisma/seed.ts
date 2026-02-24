import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // ========== 1. Education Levels ==========
    const eduPvc = await prisma.education_levels.upsert({
        where: { name: 'ปวช.' },
        update: {},
        create: { name: 'ปวช.' },
    })
    const eduPvs = await prisma.education_levels.upsert({
        where: { name: 'ปวส.' },
        update: {},
        create: { name: 'ปวส.' },
    })
    console.log('✅ Education levels created')

    // ========== 2. Departments (10 rows) ==========
    const departmentNames = [
        'แผนกวิชาเทคโนโลยีสารสนเทศ',
        'แผนกวิชาช่างยนต์',
        'แผนกวิชาช่างไฟฟ้ากำลัง',
        'แผนกวิชาช่างอิเล็กทรอนิกส์',
        'แผนกวิชาการบัญชี',
        'แผนกวิชาการตลาด',
        'แผนกวิชาคอมพิวเตอร์ธุรกิจ',
        'แผนกวิชาช่างก่อสร้าง',
        'แผนกวิชาช่างเชื่อมโลหะ',
        'แผนกวิชาการโรงแรม',
    ]
    const departments = []
    for (const name of departmentNames) {
        const dep = await prisma.department.upsert({
            where: { depname: name },
            update: {},
            create: { depname: name },
        })
        departments.push(dep)
    }
    console.log('✅ Departments created:', departments.length)

    // ========== 3. Majors (10 rows) ==========
    const majorData = [
        { name: 'สาขาวิชาเทคโนโลยีสารสนเทศ', depIdx: 0 },
        { name: 'สาขาวิชาเมคคาทรอนิกส์และหุ่นยนต์', depIdx: 1 },
        { name: 'สาขาวิชาไฟฟ้ากำลัง', depIdx: 2 },
        { name: 'สาขาวิชาอิเล็กทรอนิกส์', depIdx: 3 },
        { name: 'สาขาวิชาการบัญชี', depIdx: 4 },
        { name: 'สาขาวิชาการตลาด', depIdx: 5 },
        { name: 'สาขาวิชาคอมพิวเตอร์ธุรกิจ', depIdx: 6 },
        { name: 'สาขาวิชาก่อสร้าง', depIdx: 7 },
        { name: 'สาขาวิชาช่างเชื่อมโลหะ', depIdx: 8 },
        { name: 'สาขาวิชาการโรงแรมและการท่องเที่ยว', depIdx: 9 },
    ]
    const majors = []
    for (const m of majorData) {
        const major = await prisma.major.upsert({
            where: { major_name: m.name },
            update: {},
            create: {
                major_name: m.name,
                departmentId: departments[m.depIdx].id,
            },
        })
        majors.push(major)
    }
    console.log('✅ Majors created:', majors.length)

    // ========== 4. Role 1 — Admin (10 rows) ==========
    const adminData = [
        { firstname: 'Admin', lastname: 'Admin', citizenId: '1103702589654', phone: '0987654321' },
        { firstname: 'อดิศร', lastname: 'บริหาร', citizenId: '1000100010001', phone: '0800000001' },
        { firstname: 'กมลวรรณ', lastname: 'จัดการ', citizenId: '1000100010002', phone: '0800000002' },
        { firstname: 'ชัยวัฒน์', lastname: 'ผู้ดูแล', citizenId: '1000100010003', phone: '0800000003' },
        { firstname: 'ดวงใจ', lastname: 'ระบบ', citizenId: '1000100010004', phone: '0800000004' },
        { firstname: 'เอกชัย', lastname: 'แอดมิน', citizenId: '1000100010005', phone: '0800000005' },
        { firstname: 'ฝนทิพย์', lastname: 'ควบคุม', citizenId: '1000100010006', phone: '0800000006' },
        { firstname: 'กิตติพงษ์', lastname: 'ดูแล', citizenId: '1000100010007', phone: '0800000007' },
        { firstname: 'หทัยรัตน์', lastname: 'ซัพพอร์ต', citizenId: '1000100010008', phone: '0800000008' },
        { firstname: 'อิทธิพล', lastname: 'จัดระบบ', citizenId: '1000100010009', phone: '0800000009' },
    ]
    for (const a of adminData) {
        const passHash = await hash('123456', 10)
        await prisma.user.upsert({
            where: { citizenId: a.citizenId },
            update: {},
            create: {
                firstname: a.firstname,
                lastname: a.lastname,
                citizenId: a.citizenId,
                phone: a.phone,
                role: 1,
                sex: 1,
                birthday: new Date('1990-01-01'),
                user_img: 'avatar.jpg',
                login: {
                    create: {
                        username: a.citizenId === '1103702589654' ? 'Admin' : a.citizenId,
                        password: passHash,
                        is_first_login: false,
                    },
                },
            },
        })
    }
    console.log('✅ Role 1 (Admin) created: 10')

    // ========== 5. Role 2 — Board / คณะกรรมการ (10 rows) ==========
    const boardData = [
        { firstname: 'จารุวรรณ', lastname: 'คณะกรรมการ', citizenId: '2000200020001', phone: '0820000001', sex: 2 },
        { firstname: 'กฤษฎา', lastname: 'ตรวจสอบ', citizenId: '2000200020002', phone: '0820000002', sex: 1 },
        { firstname: 'ลัดดา', lastname: 'ประเมิน', citizenId: '2000200020003', phone: '0820000003', sex: 2 },
        { firstname: 'มนตรี', lastname: 'พิจารณา', citizenId: '2000200020004', phone: '0820000004', sex: 1 },
        { firstname: 'นภาพร', lastname: 'กรรมการ', citizenId: '2000200020005', phone: '0820000005', sex: 2 },
        { firstname: 'โอภาส', lastname: 'บอร์ด', citizenId: '2000200020006', phone: '0820000006', sex: 1 },
        { firstname: 'ปาริชาต', lastname: 'สรุป', citizenId: '2000200020007', phone: '0820000007', sex: 2 },
        { firstname: 'ภูมิพัฒน์', lastname: 'อนุมัติ', citizenId: '2000200020008', phone: '0820000008', sex: 1 },
        { firstname: 'รัตนา', lastname: 'ตัดสิน', citizenId: '2000200020009', phone: '0820000009', sex: 2 },
        { firstname: 'สมบูรณ์', lastname: 'ประธาน', citizenId: '2000200020010', phone: '0820000010', sex: 1 },
    ]
    for (const b of boardData) {
        const passHash = await hash(b.citizenId, 10)
        await prisma.user.upsert({
            where: { citizenId: b.citizenId },
            update: {},
            create: {
                firstname: b.firstname,
                lastname: b.lastname,
                citizenId: b.citizenId,
                phone: b.phone,
                role: 2,
                sex: b.sex,
                birthday: new Date('1980-03-15'),
                user_img: 'avatar.jpg',
                teacher: {
                    create: {
                        departmentId: departments[0].id,
                        educationId: eduPvs.id,
                    },
                },
                login: {
                    create: {
                        username: b.citizenId,
                        password: passHash,
                        is_first_login: false,
                    },
                },
            },
        })
    }
    console.log('✅ Role 2 (Board) created: 10')

    // ========== 6. Role 3 — Department Head / หัวหน้าแผนก (10 rows) ==========
    const depHeadData = [
        { firstname: 'อานนท์', lastname: 'หัวหน้า', citizenId: '3000300030001', phone: '0830000001', sex: 1, depIdx: 0 },
        { firstname: 'บุษบา', lastname: 'ผู้นำแผนก', citizenId: '3000300030002', phone: '0830000002', sex: 2, depIdx: 1 },
        { firstname: 'เฉลิม', lastname: 'ดูแลแผนก', citizenId: '3000300030003', phone: '0830000003', sex: 1, depIdx: 2 },
        { firstname: 'ดาริน', lastname: 'ประจำแผนก', citizenId: '3000300030004', phone: '0830000004', sex: 2, depIdx: 3 },
        { firstname: 'เอนก', lastname: 'หัวหน้างาน', citizenId: '3000300030005', phone: '0830000005', sex: 1, depIdx: 4 },
        { firstname: 'ฟ้าใส', lastname: 'แผนกวิชา', citizenId: '3000300030006', phone: '0830000006', sex: 2, depIdx: 5 },
        { firstname: 'กรกฎ', lastname: 'คุมแผนก', citizenId: '3000300030007', phone: '0830000007', sex: 1, depIdx: 6 },
        { firstname: 'เหมือนฝัน', lastname: 'จัดแผนก', citizenId: '3000300030008', phone: '0830000008', sex: 2, depIdx: 7 },
        { firstname: 'อิศรา', lastname: 'บริหารแผนก', citizenId: '3000300030009', phone: '0830000009', sex: 1, depIdx: 8 },
        { firstname: 'จันทร์เพ็ญ', lastname: 'ควบคุมแผนก', citizenId: '3000300030010', phone: '0830000010', sex: 2, depIdx: 9 },
    ]
    for (const d of depHeadData) {
        const passHash = await hash(d.citizenId, 10)
        await prisma.user.upsert({
            where: { citizenId: d.citizenId },
            update: {},
            create: {
                firstname: d.firstname,
                lastname: d.lastname,
                citizenId: d.citizenId,
                phone: d.phone,
                role: 3,
                sex: d.sex,
                birthday: new Date('1978-07-20'),
                user_img: 'avatar.jpg',
                teacher: {
                    create: {
                        departmentId: departments[d.depIdx].id,
                        majorId: majors[d.depIdx].id,
                        educationId: eduPvs.id,
                    },
                },
                login: {
                    create: {
                        username: d.citizenId,
                        password: passHash,
                        is_first_login: false,
                    },
                },
            },
        })
    }
    console.log('✅ Role 3 (Department Head) created: 10')

    // ========== 7. Role 4 — Teacher / อาจารย์ (10 rows) ==========
    const teacherData = [
        { firstname: 'สมชาย', lastname: 'ใจดี', citizenId: '1100100100001', phone: '0812345001', sex: 1, depIdx: 0, majorIdx: 0 },
        { firstname: 'สมหญิง', lastname: 'รักเรียน', citizenId: '1100100100002', phone: '0812345002', sex: 2, depIdx: 1, majorIdx: 1 },
        { firstname: 'ประเสริฐ', lastname: 'มั่นคง', citizenId: '1100100100003', phone: '0812345003', sex: 1, depIdx: 2, majorIdx: 2 },
        { firstname: 'วิไล', lastname: 'สุขสม', citizenId: '1100100100004', phone: '0812345004', sex: 2, depIdx: 3, majorIdx: 3 },
        { firstname: 'บุญมี', lastname: 'ศรีสุข', citizenId: '1100100100005', phone: '0812345005', sex: 1, depIdx: 4, majorIdx: 4 },
        { firstname: 'พรทิพย์', lastname: 'ทองดี', citizenId: '1100100100006', phone: '0812345006', sex: 2, depIdx: 5, majorIdx: 5 },
        { firstname: 'ธนากร', lastname: 'เจริญ', citizenId: '1100100100007', phone: '0812345007', sex: 1, depIdx: 6, majorIdx: 6 },
        { firstname: 'สุภาพ', lastname: 'ก้าวหน้า', citizenId: '1100100100008', phone: '0812345008', sex: 2, depIdx: 7, majorIdx: 7 },
        { firstname: 'อนุชา', lastname: 'กล้าหาญ', citizenId: '1100100100009', phone: '0812345009', sex: 1, depIdx: 8, majorIdx: 8 },
        { firstname: 'มาลี', lastname: 'ชูศรี', citizenId: '1100100100010', phone: '0812345010', sex: 2, depIdx: 9, majorIdx: 9 },
    ]
    const teachers = []
    for (const t of teacherData) {
        const passHash = await hash(t.citizenId, 10)
        const user = await prisma.user.upsert({
            where: { citizenId: t.citizenId },
            update: {},
            create: {
                firstname: t.firstname,
                lastname: t.lastname,
                citizenId: t.citizenId,
                phone: t.phone,
                sex: t.sex,
                role: 4,
                birthday: new Date('1985-06-15'),
                user_img: 'avatar.jpg',
                teacher: {
                    create: {
                        departmentId: departments[t.depIdx].id,
                        majorId: majors[t.majorIdx].id,
                        educationId: eduPvs.id,
                    },
                },
                login: {
                    create: {
                        username: t.citizenId,
                        password: passHash,
                        is_first_login: false,
                    },
                },
            },
            include: { teacher: true },
        })
        teachers.push(user)
    }
    console.log('✅ Role 4 (Teacher) created:', teachers.length)

    // ========== 8. Role 5 — Supervision / ครูนิเทศ (10 rows) ==========
    const supervisionData = [
        { firstname: 'วิทยา', lastname: 'นิเทศ', citizenId: '5000500050001', phone: '0850000001', sex: 1, depIdx: 0 },
        { firstname: 'กัลยา', lastname: 'ติดตาม', citizenId: '5000500050002', phone: '0850000002', sex: 2, depIdx: 1 },
        { firstname: 'ชาตรี', lastname: 'ตรวจเยี่ยม', citizenId: '5000500050003', phone: '0850000003', sex: 1, depIdx: 2 },
        { firstname: 'ดารณี', lastname: 'ประสาน', citizenId: '5000500050004', phone: '0850000004', sex: 2, depIdx: 3 },
        { firstname: 'เอกราช', lastname: 'ประเมินผล', citizenId: '5000500050005', phone: '0850000005', sex: 1, depIdx: 4 },
        { firstname: 'ฝนดาว', lastname: 'สังเกตการณ์', citizenId: '5000500050006', phone: '0850000006', sex: 2, depIdx: 5 },
        { firstname: 'กิตติศักดิ์', lastname: 'นิเทศก์', citizenId: '5000500050007', phone: '0850000007', sex: 1, depIdx: 6 },
        { firstname: 'หฤทัย', lastname: 'ดูงาน', citizenId: '5000500050008', phone: '0850000008', sex: 2, depIdx: 7 },
        { firstname: 'อินทร', lastname: 'ตรวจงาน', citizenId: '5000500050009', phone: '0850000009', sex: 1, depIdx: 8 },
        { firstname: 'จิรา', lastname: 'ติดตามผล', citizenId: '5000500050010', phone: '0850000010', sex: 2, depIdx: 9 },
    ]
    for (const sv of supervisionData) {
        const passHash = await hash(sv.citizenId, 10)
        await prisma.user.upsert({
            where: { citizenId: sv.citizenId },
            update: {},
            create: {
                firstname: sv.firstname,
                lastname: sv.lastname,
                citizenId: sv.citizenId,
                phone: sv.phone,
                role: 5,
                sex: sv.sex,
                birthday: new Date('1982-11-10'),
                user_img: 'avatar.jpg',
                teacher: {
                    create: {
                        departmentId: departments[sv.depIdx].id,
                        majorId: majors[sv.depIdx].id,
                        educationId: eduPvs.id,
                    },
                },
                login: {
                    create: {
                        username: sv.citizenId,
                        password: passHash,
                        is_first_login: false,
                    },
                },
            },
        })
    }
    console.log('✅ Role 5 (Supervision) created: 10')

    // ========== 9. Role 6 — Company / สถานประกอบการ (10 rows) ==========
    const companyData = [
        { name: 'บริษัท ไทยเทค จำกัด', address: '123 ถนนสุขุมวิท กรุงเทพฯ', firstname: 'วิชัย', lastname: 'ธุรกิจดี', citizenId: '3100100100001', phone: '0811111001' },
        { name: 'บริษัท ซอฟต์แวร์โซลูชัน จำกัด', address: '456 ถนนพหลโยธิน กรุงเทพฯ', firstname: 'มานะ', lastname: 'พัฒนา', citizenId: '3100100100002', phone: '0811111002' },
        { name: 'บริษัท ออโตเมชัน จำกัด', address: '789 ถนนรามอินทรา กรุงเทพฯ', firstname: 'สมศักดิ์', lastname: 'อุตสาหะ', citizenId: '3100100100003', phone: '0811111003' },
        { name: 'บริษัท อิเล็กทริค จำกัด', address: '101 ถนนลาดพร้าว กรุงเทพฯ', firstname: 'ศิริ', lastname: 'สว่าง', citizenId: '3100100100004', phone: '0811111004' },
        { name: 'บริษัท แอคเคาท์ติ้ง จำกัด', address: '202 ถนนสาทร กรุงเทพฯ', firstname: 'นิตยา', lastname: 'บัญชี', citizenId: '3100100100005', phone: '0811111005' },
        { name: 'บริษัท มาร์เก็ตติ้ง จำกัด', address: '303 ถนนสีลม กรุงเทพฯ', firstname: 'วรพจน์', lastname: 'ตลาด', citizenId: '3100100100006', phone: '0811111006' },
        { name: 'บริษัท ดิจิทัลเวิร์ค จำกัด', address: '404 ถนนเพชรบุรี กรุงเทพฯ', firstname: 'อรุณ', lastname: 'ดิจิทัล', citizenId: '3100100100007', phone: '0811111007' },
        { name: 'บริษัท คอนสตรัค จำกัด', address: '505 ถนนงามวงศ์วาน กรุงเทพฯ', firstname: 'พงษ์ศักดิ์', lastname: 'สร้างสรรค์', citizenId: '3100100100008', phone: '0811111008' },
        { name: 'บริษัท เวลด์เทค จำกัด', address: '606 ถนนรัชดาภิเษก กรุงเทพฯ', firstname: 'ปรีชา', lastname: 'เชื่อม', citizenId: '3100100100009', phone: '0811111009' },
        { name: 'บริษัท โฮเทลกรุ๊ป จำกัด', address: '707 ถนนเจริญกรุง กรุงเทพฯ', firstname: 'จาริน', lastname: 'บริการ', citizenId: '3100100100010', phone: '0811111010' },
    ]
    const companies = []
    for (const c of companyData) {
        const passHash = await hash(c.citizenId, 10)
        const existingUser = await prisma.user.findUnique({ where: { citizenId: c.citizenId } })
        if (existingUser) {
            const comp = await prisma.companies.findFirst({ where: { userId: existingUser.id } })
            if (comp) companies.push(comp)
            continue
        }
        const user = await prisma.user.create({
            data: {
                firstname: c.firstname,
                lastname: c.lastname,
                citizenId: c.citizenId,
                phone: c.phone,
                role: 6,
                sex: 1,
                birthday: new Date('1975-01-01'),
                login: {
                    create: {
                        username: c.citizenId,
                        password: passHash,
                        is_first_login: false,
                    },
                },
                company: {
                    create: {
                        name: c.name,
                        address: c.address,
                    },
                },
            },
            include: { company: true },
        })
        if (user.company) companies.push(user.company)
    }
    console.log('✅ Role 6 (Company) created:', companies.length)

    // ========== 10. Role 7 — Student / นักศึกษา (10 rows) ==========
    const studentData = [
        { firstname: 'กิตติ', lastname: 'แสงจันทร์', citizenId: '1200200200001', phone: '0912345001', sex: 1, studentId: '66301010001', depIdx: 0, majorIdx: 0, eduId: eduPvs.id },
        { firstname: 'นภัสสร', lastname: 'ดวงแก้ว', citizenId: '1200200200002', phone: '0912345002', sex: 2, studentId: '66301010002', depIdx: 0, majorIdx: 0, eduId: eduPvs.id },
        { firstname: 'ธนพล', lastname: 'วงศ์ศรี', citizenId: '1200200200003', phone: '0912345003', sex: 1, studentId: '66301020001', depIdx: 1, majorIdx: 1, eduId: eduPvc.id },
        { firstname: 'ปิยะ', lastname: 'มหาชัย', citizenId: '1200200200004', phone: '0912345004', sex: 1, studentId: '66301020002', depIdx: 1, majorIdx: 1, eduId: eduPvc.id },
        { firstname: 'วรรณา', lastname: 'กลิ่นหอม', citizenId: '1200200200005', phone: '0912345005', sex: 2, studentId: '66301030001', depIdx: 2, majorIdx: 2, eduId: eduPvs.id },
        { firstname: 'สุรชัย', lastname: 'อินทร์ทอง', citizenId: '1200200200006', phone: '0912345006', sex: 1, studentId: '66301030002', depIdx: 3, majorIdx: 3, eduId: eduPvc.id },
        { firstname: 'พิมพ์ลดา', lastname: 'จันทร์เพ็ญ', citizenId: '1200200200007', phone: '0912345007', sex: 2, studentId: '66301040001', depIdx: 4, majorIdx: 4, eduId: eduPvs.id },
        { firstname: 'ณัฐพงษ์', lastname: 'ยอดดี', citizenId: '1200200200008', phone: '0912345008', sex: 1, studentId: '66301040002', depIdx: 5, majorIdx: 5, eduId: eduPvc.id },
        { firstname: 'อัจฉรา', lastname: 'สุขเสมอ', citizenId: '1200200200009', phone: '0912345009', sex: 2, studentId: '66301050001', depIdx: 6, majorIdx: 6, eduId: eduPvs.id },
        { firstname: 'เกรียงไกร', lastname: 'แสนสุข', citizenId: '1200200200010', phone: '0912345010', sex: 1, studentId: '66301050002', depIdx: 7, majorIdx: 7, eduId: eduPvc.id },
    ]
    const students = []
    for (const s of studentData) {
        const passHash = await hash('01/01/2543', 10)
        const user = await prisma.user.upsert({
            where: { citizenId: s.citizenId },
            update: {},
            create: {
                firstname: s.firstname,
                lastname: s.lastname,
                citizenId: s.citizenId,
                phone: s.phone,
                sex: s.sex,
                role: 7,
                birthday: new Date('2000-01-01'),
                user_img: 'avatar.jpg',
                student: {
                    create: {
                        studentId: s.studentId,
                        educationLevel: s.eduId,
                        major_id: majors[s.majorIdx].id,
                        departmentId: departments[s.depIdx].id,
                        academicYear: '2566',
                        term: '2',
                        room: '1',
                        gradeLevel: 'ปวส.2',
                    },
                },
                login: {
                    create: {
                        username: s.studentId,
                        password: passHash,
                        is_first_login: false,
                    },
                },
            },
            include: { student: true },
        })
        students.push(user)
    }
    console.log('✅ Role 7 (Student) created:', students.length)

    // ========== 11. StudentCompanies (link students to companies) ==========
    for (let i = 0; i < students.length; i++) {
        const student = students[i]
        const company = companies[i % companies.length]
        if (!student.student || !company) continue

        const existing = await prisma.studentCompanies.findFirst({
            where: { studentId: student.student.id, companyId: company.id },
        })
        if (existing) continue

        await prisma.studentCompanies.create({
            data: {
                studentId: student.student.id,
                companyId: company.id,
                startDate: new Date('2026-01-15'),
                endDate: new Date('2026-05-15'),
            },
        })
    }
    console.log('✅ StudentCompanies linked')

    // ========== 12. Inturnships ==========
    for (const s of students) {
        if (!s.student) continue
        const existing = await prisma.inturnship.findUnique({ where: { studentId: s.student.id } })
        if (existing) continue

        await prisma.inturnship.create({
            data: {
                studentId: s.student.id,
                selectedDays: JSON.stringify(['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์']),
                dayperweeks: '5',
            },
        })
    }
    console.log('✅ Inturnships created')

    // ========== 13. InternshipReports ==========
    for (let i = 0; i < students.length; i++) {
        const s = students[i]
        if (!s.student) continue

        const existing = await prisma.internshipReport.findFirst({ where: { studentId: s.student.id } })
        if (existing) continue

        await prisma.internshipReport.create({
            data: {
                studentId: s.student.id,
                title: `รายงานการฝึกงานสัปดาห์ที่ ${i + 1}`,
                description: `รายละเอียดกิจกรรมการฝึกงานของ ${s.firstname} ${s.lastname} ประจำสัปดาห์ที่ ${i + 1}`,
                reportDate: new Date(`2026-02-${String(i + 1).padStart(2, '0')}`),
            },
        })
    }
    console.log('✅ Internship Reports created')

    // ========== 14. Supervisions ==========
    for (let i = 0; i < students.length; i++) {
        const s = students[i]
        if (!s.student) continue

        const sc = await prisma.studentCompanies.findFirst({ where: { studentId: s.student.id } })
        if (!sc) continue

        const teacherUser = teachers[i % teachers.length] as any
        if (!teacherUser?.teacher) continue

        const existing = await prisma.supervision.findFirst({
            where: { studentId: s.student.id, companyId: sc.companyId, teacherId: teacherUser.teacher.id },
        })
        if (existing) continue

        const types = ['ON_SITE', 'ONLINE', 'PHONE'] as const
        await prisma.supervision.create({
            data: {
                studentId: s.student.id,
                companyId: sc.companyId,
                teacherId: teacherUser.teacher.id,
                supervisionDate: new Date(`2026-02-${String(i + 10).padStart(2, '0')}`),
                notes: `บันทึกการนิเทศครั้งที่ ${i + 1} - นักศึกษาทำงานได้ดี มีความก้าวหน้า`,
                type: types[i % 3],
            },
        })
    }
    console.log('✅ Supervisions created')

    console.log('')
    console.log('🎉 Seeding finished successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Summary (per role):')
    console.log('   Role 1 (Admin):           10 users')
    console.log('   Role 2 (Board):           10 users')
    console.log('   Role 3 (Department Head): 10 users')
    console.log('   Role 4 (Teacher):         10 users')
    console.log('   Role 5 (Supervision):     10 users')
    console.log('   Role 6 (Company):         10 users')
    console.log('   Role 7 (Student):         10 users')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Other data:')
    console.log(`   Departments:      ${departments.length}`)
    console.log(`   Majors:           ${majors.length}`)
    console.log(`   Companies:        ${companies.length}`)
    console.log(`   StudentCompanies: ${students.length}`)
    console.log(`   Inturnships:      ${students.length}`)
    console.log(`   Reports:          ${students.length}`)
    console.log(`   Supervisions:     ${students.length}`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
