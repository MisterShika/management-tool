import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();

  try {
    const report = await prisma.dailyReport.create({
      data: {
        visitId: body.visitId,
        note: body.note,
        addedById: body.addedById,
      },
    });
    return NextResponse.json(report);
  } catch (err) {
    console.error("Error creating daily report:", err);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
