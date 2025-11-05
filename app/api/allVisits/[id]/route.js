import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    const visit = await prisma.visit.findUnique({
      where: { id: Number(id) },
      include: {
        student: true,           // Student info
        lesson: true,            // Linked lesson (if any)
        dailyReports: {
          include: {
            addedBy: true,       // Include who wrote the report
          },
        },
        completions: {
          include: {
            lesson: true,        // Include lesson details for completions
          },
        },
        addedBy: true,           // The user who created the visit
      },
    });

    if (!visit) {
      return NextResponse.json(
        { error: "Visit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(visit);
  } catch (err) {
    console.error("Error fetching visit:", err);
    return NextResponse.json(
      { error: "Failed to fetch visit" },
      { status: 500 }
    );
  }
}


export async function PATCH(req, context) {
  const { id } = await context.params;
  const body = await req.json();

  try {
    const updatedVisit = await prisma.visit.update({
      where: { id: Number(id) },
      data: {
        status: body.status,
        lessonId: body.lessonId ?? undefined,
      },
      include: {
        student: true,
        lesson: true,
        dailyReports: { include: { addedBy: true } },
        completions: { include: { lesson: true } },
        addedBy: true,
      },
    });

    return NextResponse.json(updatedVisit);
  } catch (err) {
    console.error("Error updating visit:", err);
    return NextResponse.json({ error: "Failed to update visit" }, { status: 500 });
  }
}