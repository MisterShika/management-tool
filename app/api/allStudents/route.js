import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────
// GET — fetch all students
// ─────────────────────────────────────
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        firstNameFurigana: true,
        lastNameFurigana: true,
        birthday: true,
        address: true,
        school: true,
        grade: true,
        gender: true,
        schoolType: true,
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
      school,
      schoolType,
      grade,
      gender,
      color,
      isActive,
    } = body;

    // basic validation (optional)
    if (!firstName || !lastName || !school || !grade || !birthday) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        firstNameFurigana,
        lastNameFurigana,
        birthday: new Date(birthday), // ensure it's a Date object
        address,
        school,
        schoolType, // must match enum: ELEMENTARY, MIDDLE, HIGH, OTHER
        grade,
        gender, // must match enum: MALE, FEMALE, UNSPECIFIED
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
