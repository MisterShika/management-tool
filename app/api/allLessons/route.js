import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all lessons (only core fields)
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      select: {
        name: true,
        description: true,
        url: true,
        type: true,
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

// POST a new lesson
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, url, type } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newLesson = await prisma.lesson.create({
      data: {
        name,
        description,
        url,
        type, // defaults to FREE if not provided
      },
      select: {
        name: true,
        description: true,
        url: true,
        type: true,
      },
    });

    return NextResponse.json(newLesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
