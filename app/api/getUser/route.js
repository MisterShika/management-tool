import { cookies } from 'next/headers';
import { decrypt } from '../../../lib/encryption';

export async function GET() {
  try {
    // Await the cookie store properly
    const cookieStore = await cookies(); // <--- important
    const session = cookieStore.get('session');

    if (!session) {
      return new Response(JSON.stringify({ user: null }), { status: 200 });
    }

    let user;
    try {
      user = JSON.parse(decrypt(session.value));
    } catch (err) {
      console.error('Invalid session cookie', err);
      return new Response(JSON.stringify({ user: null }), { status: 200 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ user: null }), { status: 500 });
  }
}
