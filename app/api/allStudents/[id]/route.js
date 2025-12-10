import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: {
        school: true
      }
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

export async function PUT(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    const body = await req.json();


    const updatedStudent = await prisma.student.update({
      where: { id: Number(id) },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        firstNameFurigana: body.firstNameFurigana,
        lastNameFurigana: body.lastNameFurigana,
        birthday: body.birthday ? new Date(body.birthday) : undefined,
        address: body.address,
        schoolId: body.schoolId ? Number(body.schoolId) : null,
        grade: body.grade,
        gender: body.gender || null,
        color: body.color || "#000000",
        isActive: typeof body.isActive === "boolean" ? body.isActive : true,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (err) {
    console.error("Error updating student:", err);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    const student = await prisma.student.update({
      where: { id: Number(id) },
      data: { isActive: false }, // Soft-delete by switching to false
    });

    return NextResponse.json({ message: "Student deleted successfully", student });
  } catch (err) {
    console.error("Error deleting student:", err);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}