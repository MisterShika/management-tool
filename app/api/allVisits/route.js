import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET → fetch all visits
export async function GET() {
  try {
    const visits = await prisma.visit.findMany({
      include: {
        student: true,
        lesson: true,
        dailyReport: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 });
  }
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
        dailyReport: note ? { create: { note } } : undefined,
      },
      include: {
        student: true,
        lesson: true,
        dailyReport: true,
      },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error("Error creating visit:", error);
    return NextResponse.json({ error: "Failed to create visit" }, { status: 500 });
  }
}
