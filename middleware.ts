import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-please-change';

const base64url = (input: ArrayBuffer | string) => {
  const bytes =
    typeof input === 'string'
      ? new TextEncoder().encode(input)
      : new Uint8Array(input);
  let str = '';
  for (const byte of bytes) str += String.fromCodePoint(byte);
  return btoa(str)
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_');
};

const decodeBase64Url = (b64url: string) => {
  const b64 = b64url.replaceAll('-', '+').replaceAll('_', '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  const str = atob(b64 + pad);
  const bytes = new Uint8Array(str.length);
  for (const [i, char] of [...str].entries()) {
    bytes[i] = char.codePointAt(0) ?? 0;
  }
  return bytes.buffer;
};

async function hmacSHA256(data: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(data)
  );
  return base64url(signature);
}

async function verifyJWT(
  token: string,
  secret: string
): Promise<{ role?: string; exp?: number } | null> {
  try {
    const [headerEnc, payloadEnc, signature] = token.split('.');
    if (!headerEnc || !payloadEnc || !signature) return null;
    const data = `${headerEnc}.${payloadEnc}`;
    const expectedSig = await hmacSHA256(data, secret);
    if (signature !== expectedSig) return null;
    const payloadJson = new TextDecoder().decode(decodeBase64Url(payloadEnc));
    const payload = JSON.parse(payloadJson) as { role?: string; exp?: number };
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/management')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  const payload = await verifyJWT(token, JWT_SECRET);
  if (!payload || payload.role !== 'admin') {
    const url = new URL('/not-authorized', request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/management/:path*'],
};
