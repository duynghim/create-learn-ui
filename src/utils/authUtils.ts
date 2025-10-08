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
