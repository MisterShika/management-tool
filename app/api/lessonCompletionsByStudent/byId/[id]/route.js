import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "studentId is required" }, { status: 400 });
  }

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        completions: {
          some: {
            studentId: Number(id),
          },
        },
      },
      orderBy: {
        id: "asc",
      },
      include: {
        completions: {
          where: {
            studentId: Number(id),
          },
          orderBy: {
            completedAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(lessons);
  } catch (err) {
    console.error("Error fetching completed lessons:", err);
    return NextResponse.json(
      { error: "Failed to fetch completed lessons" },
      { status: 500 }
    );
  }
}