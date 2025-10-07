// src/lib/jwt.ts
export type JWTPayload = {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  exp: number;
  iat: number;
};

const base64url = (input: Uint8Array | string) => {
  const str =
    typeof input === 'string' ? input : btoa(String.fromCodePoint(...input));
  return str.replace(/=+$/, '').replaceAll('+', '-').replaceAll('/', '_');
};

const encode = (str: string) => new TextEncoder().encode(str);

const sign = async (data: string, secret: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encode(data));
  return base64url(new Uint8Array(signature));
};

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= (a.codePointAt(i) ?? 0) ^ (b.codePointAt(i) ?? 0);
  }
  return result === 0;
};

export const signJWT = async (
  payload: Omit<JWTPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInSeconds = 60 * 60
): Promise<string> => {
  const header = { alg: 'HS256', typ: 'JWT' } as const;
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInSeconds;
  const full: JWTPayload = { ...payload, iat, exp };
  const headerEnc = base64url(JSON.stringify(header));
  const payloadEnc = base64url(JSON.stringify(full));
  const data = `${headerEnc}.${payloadEnc}`;
  const signature = await sign(data, secret);
  return `${data}.${signature}`;
};

export const verifyJWT = async (
  token: string,
  secret: string
): Promise<JWTPayload | null> => {
  try {
    const [headerEnc, payloadEnc, signature] = token.split('.');
    if (!headerEnc || !payloadEnc || !signature) return null;

    const data = `${headerEnc}.${payloadEnc}`;
    const expectedSig = await sign(data, secret);

    if (!timingSafeEqual(signature, expectedSig)) {
      return null;
    }

    const payloadJson = atob(
      payloadEnc.replaceAll('-', '+').replaceAll('_', '/')
    );
    const payload = JSON.parse(payloadJson) as JWTPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (e) {
    console.error('JWT verification failed:', e);
    return null;
  }
};
