import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
    const params = await context.params;
    const { id } = params;
    try{
        const school = await prisma.school.findUnique({
            where: { id: Number(id) },
        });

        if (!school) {
            return NextResponse.json({ error: "School not found" }, { status: 404 });
        }

        return NextResponse.json(school);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch school" }, { status: 500 });
    }
}


export async function PATCH(req, context) {
  const { id } = await context.params;
  const body = await req.json();

  try {
    const updatedSchool = await prisma.school.update({
      where: { id: Number(id) },
      data: {
        schoolName: body.schoolName,
        schoolAddress: body.schoolAddress,
        schoolPhone: body.schoolPhone || null,
        schoolType: body.schoolType,
        schoolLat: body.schoolLat || null,
        schoolLon: body.schoolLon || null,
      },
    });

    return NextResponse.json(updatedSchool);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}