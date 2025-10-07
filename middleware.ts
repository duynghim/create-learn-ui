import { NextRequest, NextResponse } from 'next/server';

const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('CRITICAL: JWT_SECRET environment variable is not set!');
    throw new Error('JWT_SECRET is required for security');
  }
  if (secret === 'dev-secret-please-change') {
    console.warn(
      'WARNING: Using default JWT_SECRET in production is insecure!'
    );
  }
  return secret;
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = await verifyJWT(token, getJWTSecret());
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Add user info to headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.sub);
    response.headers.set('x-user-role', payload.role);
    return response;
  } catch (error) {
    console.error('Middleware JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
