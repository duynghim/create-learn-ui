// src/utils/authUtils.ts
export function getStoredToken(): string | null {
  if (
    typeof globalThis !== 'undefined' &&
    typeof localStorage !== 'undefined'
  ) {
    try {
      return localStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }
  return null;
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function setAuthToken(token: string): void {
  if (typeof globalThis !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function removeAuthToken(): void {
  if (typeof globalThis !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}

export const decodeAccessTokenUser = (token: string) => {
  try {
    const payload = parseJwt(token);
    const user = {
      id: payload.sub ?? payload.userId ?? 'unknown',
      email: payload.email,
      sub: payload.sub,
      role: payload.role,
      exp: payload.exp,
      iat: payload.iat,
    };
    return user;
  } catch {
    return null;
  }
};

export const parseJwt = (token: string) => {
  const base64Url = token.split('.')[1];
  if (!base64Url) throw new Error('Invalid JWT');
  const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + (c.codePointAt(0) ?? 0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export const isExpired = (exp?: number) =>
  typeof exp === 'number' && exp * 1000 < Date.now();
