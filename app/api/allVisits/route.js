import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET → fetch all visits
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get("year"));
  const month = parseInt(searchParams.get("month"));

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const visits = await prisma.visit.findMany({
    where: { date: { gte: start, lte: end } },
    include: { student: true, lesson: true },
    orderBy: { date: "asc" },
  });

  return new Response(JSON.stringify(visits), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST → create a new visit
export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, date, status, lessonId, note } = body;

    if (!studentId || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const visit = await prisma.visit.create({
      data: {
        student: { connect: { id: studentId } },
        date: new Date(date),
        status: status || "PLANNED",
        lesson: lessonId ? { connect: { id: lessonId } } : undefined,
        dailyReports: note ? { create: { note } } : undefined,
      },
      include: {
        student: true,
        lesson: true,
        dailyReports: true,
      },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error("Error creating visit:", error);
    return NextResponse.json({ error: "Failed to create visit" }, { status: 500 });
  }
}
