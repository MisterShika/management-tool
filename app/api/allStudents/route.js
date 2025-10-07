// app/api/allStudents/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        firstNameFurigana: true,
        lastNameFurigana: true,
        birthday: true,
        address: true,
        school: true,
        grade: true,
        gender: true,
        isActive: true,
      },
      orderBy: {
        lastNameFurigana: 'asc', // sorts alphabetically by furigana
      },
    });

    return NextResponse.json(students);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}
