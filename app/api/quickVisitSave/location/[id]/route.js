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

  const { pickUpLoc } = await request.json();

  // Validate enum strictly
  if (!["NONE", "SCHOOL", "HOME"].includes(pickUpLoc)) {
    return NextResponse.json(
      { error: "Invalid pickUpLoc value" },
      { status: 400 }
    );
  }

  try {
    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: {
        pickUpLoc, // ONLY this field
      },
      select: {
        id: true,
        pickUpLoc: true,
      },
    });

    return NextResponse.json(updatedVisit);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to update pick up location" },
      { status: 500 }
    );
  }
}