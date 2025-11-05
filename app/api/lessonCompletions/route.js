import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();

  try {
    const completion = await prisma.lessonCompletion.create({
      data: {
        lessonId: body.lessonId,
        visitId: body.visitId,
      },
    });
    return NextResponse.json(completion);
  } catch (err) {
    console.error("Error adding completion:", err);
    return NextResponse.json({ error: "Failed to add completion" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const body = await req.json();

  try {
    await prisma.lessonCompletion.delete({
      where: { id: body.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting completion:", err);
    return NextResponse.json({ error: "Failed to delete completion" }, { status: 500 });
  }
}
