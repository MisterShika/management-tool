import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where:{
        isActive: true,
        isDriver: true,
      },
      select: {
        id: true,
        lastName: true,
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