import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-please-change';

export const GET = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const payload = await verifyJWT(token, JWT_SECRET);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    user: { email: payload.email, name: payload.name, role: payload.role },
  });
};
