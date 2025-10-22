// api/allLessons/byId/[id]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: Number(id) },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (err) {
    console.error("Error fetching lesson:", err);
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params; // must await params
  const body = await req.json();

  try {
    const updatedLesson = await prisma.lesson.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        description: body.description,
        url: body.url,
        type: body.type,
        // remove any invalid fields like `focus`
      }
    });

    return new Response(JSON.stringify(updatedLesson), { status: 200 });
  } catch (err) {
    console.error("Error updating lesson:", err);
    return new Response("Failed to update lesson", { status: 500 });
  }
}