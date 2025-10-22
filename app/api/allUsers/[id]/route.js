import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/allUsers/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params; // ✅ must await in Next.js dynamic routes

    // Convert to integer if using numeric IDs
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        userCode: true,
        firstName: true,
        firstNameFurigana: true,
        lastName: true,
        lastNameFurigana: true,
        pin: true,
        access: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        userCode: body.userCode,
        firstName: body.firstName,
        firstNameFurigana: body.firstNameFurigana,
        lastName: body.lastName,
        lastNameFurigana: body.lastNameFurigana,
        pin: body.pin,
        access: body.access,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}