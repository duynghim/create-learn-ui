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
