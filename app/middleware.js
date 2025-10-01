// app/middleware.js
import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { decrypt } from './lib/encryption';  // your decrypt function

// This middleware runs for every request and checks for cookies
export function middleware(request) {
  const cookies = parse(request.headers.get('cookie') || '');
  const session = cookies.session;

  if (!session) {
    return NextResponse.next();  // Proceed if there's no session
  }

  try {
    const user = JSON.parse(decrypt(session));  // Decrypt session to get user
    request.user = user;  // Attach the user to the request
  } catch (error) {
    console.error('Invalid session cookie', error);
  }

  return NextResponse.next();  // Proceed to the next middleware or page
}

export const config = {
  matcher: ['/'],  // Apply the middleware to the homepage (or adjust to your needs)
};
