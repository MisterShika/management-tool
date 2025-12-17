import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const visitId = Number(id);

  const { pickUpTime } = await request.json();

  console.log("Received pickUpTime:", pickUpTime);

  let finalTime = null;

  if (pickUpTime) {
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      select: { date: true },
    });

    if (!visit) {
      return NextResponse.json(
        { error: "Visit not found" },
        { status: 404 }
      );
    }

    // LOCAL date (important)
    const datePart = visit.date.toLocaleDateString("en-CA");

    finalTime = new Date(`${datePart}T${pickUpTime}:00`);

    if (Number.isNaN(finalTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid date constructed" },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.visit.update({
    where: { id: visitId },
    data: { pickUpTime: finalTime },
    select: { id: true, pickUpTime: true },
  });

  return NextResponse.json(updated);
}
