import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, context) {
  const params = await context.params;
  const todaysDate = new Date(params.date);

  try {
    const visits = await prisma.visit.findMany({
      where: { date: todaysDate },
      include: {
        student: {
          include: {
            school: true,
          },
        },
        lesson: true,
      },
      orderBy: {
        pickUpTime: "asc",
      },
    });

    const enriched = visits.map((visit) => {
      let pickupLat = null;
      let pickupLon = null;

      if (visit.pickUpLoc === "HOME") {
        pickupLat = visit.student.studentLat;
        pickupLon = visit.student.studentLon;
      }

      if (visit.pickUpLoc === "SCHOOL") {
        pickupLat = visit.student.school?.schoolLat ?? null;
        pickupLon = visit.student.school?.schoolLon ?? null;
      }

      return {
        ...visit,
        pickupCoords: pickupLat && pickupLon
          ? { lat: pickupLat, lon: pickupLon }
          : null,
      };
    });

    return NextResponse.json(enriched);
  } catch (err) {
    console.error("Error fetching visits:", err);
    return NextResponse.json(
      { error: "Failed to fetch visit" },
      { status: 500 }
    );
  }
}
