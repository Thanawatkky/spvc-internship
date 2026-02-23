import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "public", "example_student.xlsx");

        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: "File not found" },
                { status: 404 }
            );
        }

        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Disposition": 'attachment; filename="example_student.xlsx"',
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
        });
    } catch (error) {
        console.error("Error downloading file:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
