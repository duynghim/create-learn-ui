import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signJWT } from '@/lib/jwt';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-please-change';
const TOKEN_TTL = 60 * 60 * 12; // 12 hours

// Very simple mock validation. Any non-empty email/password works.
// Role assignment rule (mock): if email includes 'admin,' then a role=admin, else user.
export const POST = async (req: NextRequest) => {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;
  const email = (body?.email ?? '').trim().toLowerCase();
  const password = (body?.password ?? '').trim();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  const role: 'admin' | 'user' = email.includes('admin') ? 'admin' : 'user';
  const name = email.split('@')[0] || 'User';

  const token = await signJWT(
    { sub: email, email, name, role },
    JWT_SECRET,
    TOKEN_TTL
  );

  const cookieStore = cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOKEN_TTL,
  });

  return NextResponse.json({
    user: { email, name, role },
    token,
  });
};
