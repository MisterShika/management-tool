import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, context) {
  try {
      const { type } = await context.params;

    // Optional: validate type against your enum
    const validTypes = ['FREE', 'MINECRAFT', 'SCRATCH', 'INDEPENDENT', 'OTHER'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid lesson type' }, { status: 400 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { type },
      select: {
        id: true,
        name: true,
        url: true,
        type: true,
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}
