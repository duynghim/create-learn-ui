// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/management'];
const publicRoutes = [
  '/login',
  '/',
  '/classes',
  '/camps',
  '/subjects',
  '/events',
  '/programs',
  '/about',
  '/blog',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const hasAuthCookie =
    request.cookies.has('auth_token') || request.headers.get('authorization');

  if (isProtectedRoute && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && hasAuthCookie) {
    return NextResponse.redirect(new URL('/management', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public|images).*)'],
};
