import crypto from 'node:crypto';

export type JWTPayload = {
  sub: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  exp: number; // seconds since epoch
  iat: number; // seconds since epoch
};

const base64url = (input: Buffer | string) =>
  Buffer.from(input)
    .toString('base64')
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_');

const sign = (data: string, secret: string) =>
  base64url(crypto.createHmac('sha256', secret).update(data).digest());

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
  const signature = sign(data, secret);
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
    const expectedSig = sign(data, secret);
    if (
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
    ) {
      return null;
    }
    const payloadJson = Buffer.from(
      payloadEnc.replaceAll('-', '+').replaceAll('_', '/'),
      'base64'
    ).toString('utf-8');
    const payload = JSON.parse(payloadJson) as JWTPayload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch (e) {
    console.error('JWT verification failed:', e);
    return null;
  }
};
