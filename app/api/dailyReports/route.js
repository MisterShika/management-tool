import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — fetch all reports for a visit
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const visitId = searchParams.get("visitId");

    if (!visitId) {
      return NextResponse.json(
        { error: "visitId is required" },
        { status: 400 }
      );
    }

    const reports = await prisma.dailyReport.findMany({
      where: { visitId: Number(visitId) },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (err) {
    console.error("Error fetching daily reports:", err);
    return NextResponse.json(
      { error: "Failed to fetch daily reports" },
      { status: 500 }
    );
  }
}

// POST — create a new daily report
export async function POST(req) {
  try {
    const body = await req.json();

    const report = await prisma.dailyReport.create({
      data: {
        visitId: Number(body.visitId),
        note: body.note,
        addedById: Number(body.userId),
      },
    });

    return NextResponse.json(report);
  } catch (err) {
    console.error("Error creating daily report:", err);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const reportId = body.id;

    if (!reportId) {
      return NextResponse.json(
        { error: "reportId is required" },
        { status: 400 }
      );
    }

    await prisma.dailyReport.delete({
      where: { id: Number(reportId) },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting report:", err);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, note } = body;

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    const updated = await prisma.dailyReport.update({
      where: { id: Number(id) },
      data: {
        ...(note !== undefined && { note }),
      },
    });

    return Response.json(updated);
  } catch (err) {
    console.error("Error updating report:", err);
    return Response.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}