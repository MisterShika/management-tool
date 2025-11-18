import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  const { id } = context.params; // visit ID from URL
  const body = await req.json(); // expect { lessonId: number }

  if (!body.lessonId) {
    return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
  }

  try {
    const completion = await prisma.lessonCompletion.create({
      data: {
        visitId: Number(id),
        lessonId: Number(body.lessonId),
      },
      include: {
        lesson: true, // return lesson details if you want
      },
    });

    return NextResponse.json(completion);
  } catch (err) {
    console.error("Error creating lesson completion:", err);
    return NextResponse.json({ error: "Failed to add completed lesson" }, { status: 500 });
  }
}
