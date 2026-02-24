import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const student = await prisma.student.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            user: true,
            department: true,
            major: true,
            education: true,
            inturnship: true,
            report: true
        }
    })

    // ค้นหาครูที่ปรึกษา (role=4) ที่ตรงกับแผนก, สาขา, และห้องของนักศึกษา
    let advisor = null;
    if (student) {
        advisor = await prisma.teacher.findFirst({
            where: {
                departmentId: student.departmentId,
                majorId: student.major_id,
                room: student.room,
                user: {
                    role: 4
                }
            },
            include: {
                user: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });
    }

    return NextResponse.json({ ...student, advisor });
}