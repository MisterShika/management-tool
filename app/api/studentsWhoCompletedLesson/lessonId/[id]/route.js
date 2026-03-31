import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const params = await context.params;
  const { id } = params; // lessonId

  if (!id) {
    return NextResponse.json(
      { error: "lessonId is required" },
      { status: 400 }
    );
  }

  try {
    const completions = await prisma.lessonCompletion.findMany({
      where: {
        lessonId: Number(id),
      },
      include: {
        student: true,
        visit: true,
      },
      orderBy: {
        studentId: "asc",
      },
    });

    return NextResponse.json(completions);
  } catch (err) {
    console.error("Error fetching students for lesson:", err);
    return NextResponse.json(
      { error: "Failed to fetch students for lesson" },
      { status: 500 }
    );
  }
}