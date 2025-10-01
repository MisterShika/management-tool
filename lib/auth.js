// lib/auth.js
import { cookies } from 'next/headers'; // import cookies() from next/headers

export function getUserFromRequest() {
  const cookieStore = cookies();
  const session = cookieStore.get('session'); // get session cookie

  if (!session) return null;

  try {
    const user = JSON.parse(decrypt(session.value)); // decrypt cookie value
    return user; // { id, access }
  } catch (err) {
    console.error("Invalid session cookie", err);
    return null;
  }
}
