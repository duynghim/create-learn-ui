import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const POST = async () => {
  const cookieStore = cookies();
  cookieStore.set('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return NextResponse.json({ success: true });
};
