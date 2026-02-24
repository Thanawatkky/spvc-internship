import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function findAllDepartments() {
    return await prisma.department.findMany({
        orderBy: {
            id: "desc"
        }
    })
}

export async function findOneDepartment(id: string) {
    return await prisma.department.findUnique({
        where: {
            id: Number(id)
        }
    })
}

export async function createDepartment(department: Prisma.DepartmentCreateInput) {
    return await prisma.department.create({
        data: department
    })
}

export async function updateDepartment(id: string, department: Prisma.DepartmentUpdateInput) {
    return await prisma.department.update({
        where: {
            id: Number(id)
        },
        data: department
    })
}

export async function removeDepartment(id: string) {
    return await prisma.$transaction(async (tx) => {
        const depId = Number(id);

        // ตัดความสัมพันธ์ Major → Department
        await tx.major.updateMany({
            where: { departmentId: depId },
            data: { departmentId: { set: null } }
        });

        // ตัดความสัมพันธ์ Student → Department
        await tx.student.updateMany({
            where: { departmentId: depId },
            data: { departmentId: { set: null } }
        });

        // ตัดความสัมพันธ์ Teacher → Department
        await tx.teacher.updateMany({
            where: { departmentId: depId },
            data: { departmentId: { set: null } }
        });

        // ลบแผนกวิชา
        return await tx.department.delete({
            where: { id: depId }
        });
    });
}

export async function countDepartment() {
    return await prisma.department.count();
}