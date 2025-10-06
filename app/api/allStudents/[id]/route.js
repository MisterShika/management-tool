import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
  // await params before using
  const params = await context.params;
  const { id } = params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}
