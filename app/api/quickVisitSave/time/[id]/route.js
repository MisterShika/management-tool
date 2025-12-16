import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const visitId = Number(id);

  const { pickUpTime } = await request.json();

  let finalTime = null;

  if (pickUpTime !== null) {
    // get visit date (local, not UTC)
    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      select: { date: true },
    });

    const datePart = visit.date.toISOString().split("T")[0];

    // IMPORTANT: do NOT add Z
    finalTime = new Date(`${datePart}T${pickUpTime}:00`);
  }

  const updated = await prisma.visit.update({
    where: { id: visitId },
    data: {
      pickUpTime: finalTime,
    },
    select: {
      id: true,
      pickUpTime: true,
    },
  });

  return NextResponse.json(updated);
}
