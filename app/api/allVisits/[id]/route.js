import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ GET (already good)
export async function GET(req, context) {
  const { id } = context.params;

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

// ✅ PATCH (handles saving updates from the edit page)
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

// ✅ DELETE (only allows deleting if not attached to other data)
export async function DELETE(req, context) {
  const { id } = await context.params;

  try {
    const visitId = Number(id);

    // Check if visit exists and has any relations
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        lesson: true,
        dailyReports: true,
        completions: true,
      },
    });

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    // Safety check: only delete if no linked data
    if (
      visit.lessonId !== null ||
      visit.dailyReports.length > 0 ||
      visit.completions.length > 0
    ) {
      return NextResponse.json(
        {
          error: "Cannot delete visit because it is linked to a lesson, report, or completion.",
        },
        { status: 400 }
      );
    }

    // Safe to delete
    await prisma.visit.delete({ where: { id: visitId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting visit:", err);
    return NextResponse.json({ error: "Failed to delete visit" }, { status: 500 });
  }
}