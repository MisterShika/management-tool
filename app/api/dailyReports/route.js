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
