import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const visitId = Number(id);

  if (!Number.isInteger(visitId)) {
    return NextResponse.json(
      { error: "Invalid visit ID" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    let { driverId } = body;

    // Normalize driverId
    if (driverId === "NONE" || driverId === "" || driverId === undefined) {
      driverId = null;
    } else if (driverId !== null) {
      driverId = Number(driverId);
    }

    // Validate
    if (driverId !== null && !Number.isInteger(driverId)) {
      return NextResponse.json(
        { error: "Invalid driver ID" },
        { status: 400 }
      );
    }

    // Optional: ensure user exists (recommended)
    if (driverId !== null) {
      const driver = await prisma.user.findUnique({
        where: { id: driverId },
        select: { id: true },
      });

      if (!driver) {
        return NextResponse.json(
          { error: "Driver not found" },
          { status: 400 }
        );
      }
    }

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        driverId, // null or number
      },
      select: {
        id: true,
        driverId: true,
        driver: {
          select: {
            id: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(updatedVisit);
  } catch (err) {
    console.error("Update driver error:", err);

    return NextResponse.json(
      { error: "Failed to update driver" },
      { status: 500 }
    );
  }
}