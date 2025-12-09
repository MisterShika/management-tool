import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        schoolName: true,
      },
      orderBy: { schoolName: "asc" },
    });

    return NextResponse.json(schools);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch school list" },
      { status: 500 }
    );
  }
}