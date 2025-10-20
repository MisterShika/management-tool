import { PrismaClient } from '../../../app/generated/prisma';
import { encrypt } from '../../../lib/encryption';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userCode, pin } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        userCode,
        pin,
      },
      select: {
        id: true,
        access: true,
        lastName: true,
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
    }

    // Correct async usage
    const cookieStore = await cookies(); // <-- await here
    cookieStore.set({
      name: 'session',
      value: encrypt(JSON.stringify(user)),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}
