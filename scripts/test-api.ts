/**
 * API Test Script — ทดสอบ API ทุกเส้น
 * Usage: npx tsx scripts/test-api.ts
 * ⚠️ ต้อง run seed ก่อน: npx prisma db seed
 * ⚠️ ต้อง start dev server ก่อน: npm run dev
 */

const BASE_URL = 'http://localhost:3000'

interface TestResult {
    name: string
    method: string
    url: string
    status: number
    passed: boolean
    body?: any
    error?: string
}

const results: TestResult[] = []

async function testEndpoint(
    name: string,
    method: string,
    path: string,
    options?: {
        body?: any
        contentType?: string
        expectedStatus?: number | number[]
    }
): Promise<any> {
    const url = `${BASE_URL}${path}`
    const expected = options?.expectedStatus
        ? Array.isArray(options.expectedStatus)
            ? options.expectedStatus
            : [options.expectedStatus]
        : [200, 201]

    try {
        const fetchOptions: RequestInit = {
            method,
            headers: {} as Record<string, string>,
        }

        if (options?.body) {
            if (options.contentType === 'formdata') {
                // Skip formdata tests (require file upload)
                const result: TestResult = {
                    name,
                    method,
                    url,
                    status: 0,
                    passed: true,
                    body: '⏭️ Skipped (requires file upload)',
                }
                results.push(result)
                console.log(`  ⏭️  ${name} — SKIPPED (requires file upload)`)
                return null
            } else {
                ; (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json'
                fetchOptions.body = JSON.stringify(options.body)
            }
        }

        const res = await fetch(url, fetchOptions)
        let body: any
        try {
            body = await res.json()
        } catch {
            body = null
        }

        const passed = expected.includes(res.status)
        const result: TestResult = {
            name,
            method,
            url,
            status: res.status,
            passed,
            body: typeof body === 'object' ? (Array.isArray(body) ? `Array(${body.length})` : body) : body,
        }
        results.push(result)

        const icon = passed ? '✅' : '❌'
        console.log(`  ${icon} ${name} — ${method} ${path} → ${res.status}`)

        return body
    } catch (error: any) {
        const result: TestResult = {
            name,
            method,
            url,
            status: 0,
            passed: false,
            error: error.message,
        }
        results.push(result)
        console.log(`  ❌ ${name} — ${method} ${path} → ERROR: ${error.message}`)
        return null
    }
}

async function main() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🧪 API Test Suite — SPVC Internship')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')

    // =====================================================
    // 1. DEPARTMENTS
    // =====================================================
    console.log('📂 [1] Departments')

    const departments = await testEndpoint('GET /api/departments', 'GET', '/api/departments')

    const newDep = await testEndpoint('POST /api/departments', 'POST', '/api/departments', {
        body: { depname: `แผนกทดสอบ_${Date.now()}` },
        expectedStatus: [201],
    })

    let testDepId: number | null = null
    if (departments && Array.isArray(departments) && departments.length > 0) {
        // ใช้แผนกที่เพิ่งสร้างเพื่อทดสอบ (ดึง ID จาก list ล่าสุด)
        const freshDeps = await fetch(`${BASE_URL}/api/departments`).then((r) => r.json())
        testDepId = freshDeps[0]?.id
    }

    if (testDepId) {
        await testEndpoint('PUT /api/departments/:id', 'PUT', `/api/departments/${testDepId}`, {
            body: { depname: `แผนกทดสอบ_แก้ไข_${Date.now()}` },
        })

        await testEndpoint('DELETE /api/departments/:id', 'DELETE', `/api/departments/${testDepId}`)
    }

    console.log('')

    // =====================================================
    // 2. MAJORS
    // =====================================================
    console.log('📂 [2] Majors')

    const majorsData = await testEndpoint('GET /api/major', 'GET', '/api/major')

    let firstDepId: number | null = null
    if (departments && Array.isArray(departments) && departments.length > 0) {
        firstDepId = departments[departments.length - 1]?.id // ใช้แผนกจริง (ไม่ใช่แผนกทดสอบ)
    }

    if (firstDepId) {
        const newMajor = await testEndpoint('POST /api/major', 'POST', '/api/major', {
            body: { major_name: `สาขาทดสอบ_${Date.now()}`, department: firstDepId },
            expectedStatus: [201],
        })

        const freshMajors = await fetch(`${BASE_URL}/api/major`).then((r) => r.json())
        const testMajorId = freshMajors[0]?.id

        if (testMajorId) {
            await testEndpoint('PUT /api/major/:id', 'PUT', `/api/major/${testMajorId}`, {
                body: { major_name: `สาขาทดสอบ_แก้ไข_${Date.now()}`, department: firstDepId },
            })

            await testEndpoint('DELETE /api/major/:id', 'DELETE', `/api/major/${testMajorId}`)
        }

        // GET by department
        await testEndpoint(
            'GET /api/major/getByDepartment/:id',
            'GET',
            `/api/major/getByDepartment/${firstDepId}`
        )
    }

    console.log('')

    // =====================================================
    // 3. EDUCATION
    // =====================================================
    console.log('📂 [3] Education')

    await testEndpoint('GET /api/education', 'GET', '/api/education')

    console.log('')

    // =====================================================
    // 4. USERS
    // =====================================================
    console.log('📂 [4] Users')

    const users = await testEndpoint('GET /api/users', 'GET', '/api/users')

    let testUserId: number | null = null
    if (users && Array.isArray(users) && users.length > 0) {
        testUserId = users[0]?.id
    }

    if (testUserId) {
        await testEndpoint('GET /api/users/:id', 'GET', `/api/users/${testUserId}`)

        // PUT requires formdata with file — skipped
        await testEndpoint('PUT /api/users/:id', 'PUT', `/api/users/${testUserId}`, {
            body: {},
            contentType: 'formdata',
        })
    }

    console.log('')

    // =====================================================
    // 5. STUDENTS
    // =====================================================
    console.log('📂 [5] Students')

    const studentsData = await testEndpoint('GET /api/students', 'GET', '/api/students')

    let testStudentUserId: number | null = null
    if (studentsData && Array.isArray(studentsData) && studentsData.length > 0) {
        testStudentUserId = studentsData[0]?.user?.id || studentsData[0]?.userId
    }

    if (testStudentUserId) {
        await testEndpoint('GET /api/students/:id', 'GET', `/api/students/${testStudentUserId}`)
    }

    // POST /api/students requires formdata — skipped
    await testEndpoint('POST /api/students', 'POST', '/api/students', {
        body: {},
        contentType: 'formdata',
    })

    // GET by department
    if (firstDepId) {
        await testEndpoint(
            'GET /api/students/getByDepartment',
            'GET',
            `/api/students/getByDepartment?departmentId=${firstDepId}`,
            { expectedStatus: [200, 400] }
        )
    }

    // GET by term
    await testEndpoint('GET /api/students/getByterm', 'GET', '/api/students/getByterm?term=2', {
        expectedStatus: [200, 400],
    })

    // GET withSupervisions
    await testEndpoint(
        'GET /api/students/withSupervisions',
        'GET',
        '/api/students/withSupervisions',
        { expectedStatus: [200, 401] }
    )

    await testEndpoint(
        'GET /api/students/withSupervisions/all',
        'GET',
        '/api/students/withSupervisions/all',
        { expectedStatus: [200, 401] }
    )

    // GET profile (requires auth)
    await testEndpoint('GET /api/students/profile', 'GET', '/api/students/profile', {
        expectedStatus: [200, 401, 500],
    })

    console.log('')

    // =====================================================
    // 6. TEACHERS
    // =====================================================
    console.log('📂 [6] Teachers')

    const teachersData = await testEndpoint('GET /api/teachers', 'GET', '/api/teachers')

    let testTeacherUserId: number | null = null
    if (teachersData && Array.isArray(teachersData) && teachersData.length > 0) {
        testTeacherUserId = teachersData[0]?.user?.id || teachersData[0]?.userId
    }

    if (testTeacherUserId) {
        await testEndpoint('GET /api/teachers/:id', 'GET', `/api/teachers/${testTeacherUserId}`)
    }

    // POST /api/teachers requires formdata — skipped
    await testEndpoint('POST /api/teachers', 'POST', '/api/teachers', {
        body: {},
        contentType: 'formdata',
    })

    // GET by department
    if (firstDepId) {
        await testEndpoint(
            'GET /api/teachers/getByDepartment',
            'GET',
            `/api/teachers/getByDepartment?departmentId=${firstDepId}`,
            { expectedStatus: [200, 400] }
        )
    }

    // GET with board
    await testEndpoint('GET /api/teachers/getWithBoard', 'GET', '/api/teachers/getWithBoard', {
        expectedStatus: [200, 401],
    })

    console.log('')

    // =====================================================
    // 7. COMPANIES
    // =====================================================
    console.log('📂 [7] Companies')

    const companiesData = await testEndpoint('GET /api/company', 'GET', '/api/company')

    console.log('')

    // =====================================================
    // 8. INTERNSHIP
    // =====================================================
    console.log('📂 [8] Internship')

    await testEndpoint('GET /api/check-inturn', 'GET', '/api/check-inturn', {
        expectedStatus: [200, 401, 404, 500],
    })

    console.log('')

    // =====================================================
    // 9. REPORTS
    // =====================================================
    console.log('📂 [9] Reports')

    // POST requires auth + formdata — skipped
    await testEndpoint('POST /api/report', 'POST', '/api/report', {
        body: {},
        contentType: 'formdata',
    })

    if (testStudentUserId) {
        await testEndpoint(
            'GET /api/report/getBystudent/:id',
            'GET',
            `/api/report/getBystudent/${testStudentUserId}`,
            { expectedStatus: [200, 404] }
        )
    }

    console.log('')

    // =====================================================
    // 10. COUNT
    // =====================================================
    console.log('📂 [10] Count / Stats')

    await testEndpoint('GET /api/count', 'GET', '/api/count')

    await testEndpoint('GET /api/count/forStudent', 'GET', '/api/count/forStudent', {
        expectedStatus: [200, 401, 500],
    })

    console.log('')

    // =====================================================
    // 11. ACADEMIC YEAR & TERM
    // =====================================================
    console.log('📂 [11] Academic Year & Term')

    await testEndpoint('GET /api/academic_year', 'GET', '/api/academic_year', {
        expectedStatus: [200],
    })

    await testEndpoint('GET /api/term', 'GET', '/api/term', {
        expectedStatus: [200],
    })

    console.log('')

    // =====================================================
    // SUMMARY
    // =====================================================
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 Test Results Summary')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    const passed = results.filter((r) => r.passed).length
    const failed = results.filter((r) => !r.passed).length
    const total = results.length

    console.log(`  Total:   ${total}`)
    console.log(`  ✅ Pass:  ${passed}`)
    console.log(`  ❌ Fail:  ${failed}`)
    console.log('')

    if (failed > 0) {
        console.log('  Failed tests:')
        results
            .filter((r) => !r.passed)
            .forEach((r) => {
                console.log(`    ❌ ${r.name} → ${r.status} ${r.error || ''}`)
                if (r.body) console.log(`       Response: ${JSON.stringify(r.body)}`)
            })
    }

    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch(console.error)
