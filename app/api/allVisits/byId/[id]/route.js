import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET (already good)
export async function GET(req, context) {
  const { id } = await context.params; 

  try {
    const visit = await prisma.visit.findUnique({
      where: { id: Number(id) },
      include: {
        student: true,
        lesson: true,
        dailyReports: { include: { addedBy: true } },
        completions: { include: { lesson: true } },
        addedBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    return NextResponse.json(visit);
  } catch (err) {
    console.error("Error fetching visit:", err);
    return NextResponse.json({ error: "Failed to fetch visit" }, { status: 500 });
  }
}

// PATCH (handles saving updates from the edit page)
export async function PATCH(req, context) {
  const { id } = await context.params; 
  const body = await req.json();

  try {
    const updatedVisit = await prisma.visit.update({
      where: { id: Number(id) },
      data: {
        status: body.status, // planned/completed/cancelled
        lessonId: body.lessonId ? Number(body.lessonId) : null, // allow unassigning lesson
      },
      include: {
        student: true,
        lesson: true,
        dailyReports: { include: { addedBy: true } },
        completions: { include: { lesson: true } },
        addedBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return NextResponse.json(updatedVisit);
  } catch (err) {
    console.error("Error updating visit:", err);
    return NextResponse.json({ error: "Failed to update visit" }, { status: 500 });
  }
}

// DELETE (allows deleting even if linked to a lesson)
export async function DELETE(req, context) {
  const { id } = await context.params; 

  try {
    const visitId = Number(id);

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        dailyReports: true,
        completions: true,
      },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    // Only block deletion if there are dependent records
    if (visit.dailyReports.length > 0 || visit.completions.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete visit because it has linked reports or completions." },
        { status: 409 }
      );
    }

    await prisma.visit.delete({ where: { id: visitId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting visit:", err);
    return NextResponse.json({ error: "Failed to delete visit" }, { status: 500 });
  }
}
