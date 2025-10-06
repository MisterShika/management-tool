// app/api/allUsers/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        lastNameFurigana: 'asc', // sorts alphabetically by furigana
      },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
