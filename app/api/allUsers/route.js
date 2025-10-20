import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET → fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        userCode: true,
        firstName: true,
        lastName: true,
        firstNameFurigana: true,
        lastNameFurigana: true,
        access: true,
      },
      orderBy: {
        lastNameFurigana: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST → add a new user
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userCode,
      firstName,
      lastName,
      firstNameFurigana,
      lastNameFurigana,
      pin,
      access,
    } = body;

    // basic validation
    if (
      !userCode ||
      !firstName ||
      !lastName ||
      !firstNameFurigana ||
      !lastNameFurigana ||
      !pin
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // check that PIN is exactly 4 digits
    const pinRegex = /^\d{4}$/;
    if (!pinRegex.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits" },
        { status: 400 }
      );
    }

    // create user
    const newUser = await prisma.user.create({
      data: {
        userCode,
        firstName,
        lastName,
        firstNameFurigana,
        lastNameFurigana,
        pin,
        access: access || "STAFF",
      },
      select: {
        id: true,
        userCode: true,
        firstName: true,
        lastName: true,
        firstNameFurigana: true,
        lastNameFurigana: true,
        access: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);

    // handle duplicate userCode (P2002 = unique constraint violation)
    if (err.code === "P2002" && err.meta?.target?.includes("userCode")) {
      return NextResponse.json(
        { error: "User code already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
