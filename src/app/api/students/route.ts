import { prisma } from "@/lib/db";
import { parseForm } from "@/lib/uploadFile";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        user: true,
        department: true,
        major: true,
        education: true
      }
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    // console.error("Error fetching students:", error);
    // return NextResponse.json(
    //   { message: "เกิดข้อผิดพลาดในการดึงข้อมูล", type: "error" },
    //   { status: 500 }
    // );

    return NextResponse.json(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(
      Array.from(formData.entries())
        .filter(([key]) => key !== "user_img")
        .map(([key, value]) => [key, String(value)])
    );

    // ตรวจสอบข้อมูลที่จำเป็น
    const requiredFields: { key: string; label: string }[] = [
      { key: "firstname", label: "ชื่อ" },
      { key: "lastname", label: "นามสกุล" },
      { key: "citizenId", label: "เลขบัตรประชาชน" },
      { key: "sex", label: "เพศ" },
      { key: "phone", label: "เบอร์โทรศัพท์" },
      { key: "birthday", label: "วันเกิด" },
      { key: "studentId", label: "รหัสนักศึกษา" },
      { key: "educationLevel", label: "ระดับการศึกษา" },
      { key: "major_id", label: "สาขาวิชา" },
      { key: "department", label: "แผนก" },
      { key: "academicYear", label: "ปีการศึกษา" },
      { key: "room", label: "ห้อง" },
      { key: "term", label: "ภาคเรียน" },
      { key: "gradeLevel", label: "ชั้นปี" },
    ];

    const missingFields = requiredFields.filter(
      (f) => !data[f.key] || data[f.key].trim() === ""
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `กรุณากรอกข้อมูลให้ครบ: ${missingFields.map((f) => f.label).join(", ")}`,
          type: "error",
        },
        { status: 400 }
      );
    }

    // รูปภาพไม่จำเป็นต้องอัปโหลด (ใช้รูป default ถ้าไม่มี)
    const file = formData.get("user_img") as File | null;

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { citizenId: data.citizenId },
          { phone: data.phone },
        ]
      }
    });

    if (existingUser) {
      let message = "พบข้อมูลผู้ใช้ดังกล่าวในระบบแล้ว";

      if (existingUser.citizenId === data.citizenId) {
        message = "พบข้อมูลผู้ใช้ดังกล่าวในระบบแล้ว (เลขบัตรประชาชนซ้ำ)";
      } else if (existingUser.phone === data.phone) {
        message = "พบข้อมูลเบอร์โทรศัพท์ดังกล่าวในระบบแล้ว";
      }

      return NextResponse.json(
        { message, type: "error" },
        { status: 400 }
      );
    }

    // Check for existing student ID
    const existingStudent = await prisma.student.findUnique({
      where: {
        studentId: data.studentId,
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        { message: "รหัสนักศึกษานี้มีในระบบแล้ว", type: "error" },
        { status: 400 }
      );
    }

    // Upload file ถ้ามีรูปภาพ
    let userImgPath = "avatar.jpg";
    if (file && file.size > 0) {
      userImgPath = await parseForm(file);
    }

    const passwordString = dayjs.utc(data.birthday).add(7, 'hour').add(543, 'year').format('DD/MM/YYYY')

    const user = await prisma.user.create({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        citizenId: data.citizenId,
        sex: Number(data.sex),
        phone: data.phone,
        birthday: new Date(data.birthday),
        user_img: userImgPath,

        student: {
          create: {
            studentId: data.studentId,
            educationLevel: Number(data.educationLevel),
            major_id: Number(data.major_id),
            departmentId: Number(data.department),
            academicYear: data.academicYear,
            room: data.room,
            term: data.term,
            gradeLevel: data.gradeLevel,
          },
        },
        login: {
          create: {
            username: data.studentId,
            password: bcrypt.hashSync(passwordString, 10),
          }
        }
      },
      include: {
        login: true,
        student: {
          include: {
            education: true,
            major: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "เพิ่มข้อมูลนักศึกษาสำเร็จ",
        type: "success",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
        type: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}