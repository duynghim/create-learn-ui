import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/management'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only redirect to login for management routes
  // We'll handle the actual auth check on the client side
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If trying to access management without being on login page,
  // let the client-side ProtectedRoute component handle it
  if (isProtectedRoute && pathname !== '/login') {
    // Let it through, the ProtectedRoute component will handle the auth check
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public|images).*)'],
};
