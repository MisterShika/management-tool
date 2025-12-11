import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
  const { id } = await context.params;

  try {
        const students = await prisma.student.findMany({
        where: { schoolId: Number(id) },
        select: {
            id: true,
            grade: true,
            firstName: true,
            lastName: true,
            firstNameFurigana: true,
            lastNameFurigana: true,
        },
        orderBy: {
            grade: "asc",
        },
    });

    return NextResponse.json(students, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
