import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────
// GET — fetch all students
// ─────────────────────────────────────
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      where:{
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        firstNameFurigana: true,
        lastNameFurigana: true,
        school: true,
        birthday: true,
        address: true,
        grade: true,
        gender: true,
        isActive: true,
        color: true,
      },
      orderBy: {
        lastNameFurigana: "asc",
      },
    });

    return NextResponse.json(students);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

// ─────────────────────────────────────
// POST — add a new student
// ─────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      firstNameFurigana,
      lastNameFurigana,
      birthday,
      address,
      schoolId,   // <-- NEW
      grade,
      gender,
      color,
      isActive,
    } = body;

    // Basic validation
    if (!firstName || !lastName || !birthday) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // schoolId is optional (because schema allows null)
    // But if provided, make sure it is a number
    const schoolIdValue = schoolId ? Number(schoolId) : null;

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        firstNameFurigana,
        lastNameFurigana,
        birthday: new Date(birthday),
        address,
        schoolId: schoolIdValue, // <-- correct relation field
        grade,
        gender,                  // MALE | FEMALE | UNSPECIFIED
        color: color || "#000000",
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });

  } catch (err) {
    console.error("Failed to create student:", err);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}