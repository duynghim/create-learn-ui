// src/api/authApi.ts
import type { ApiConfig, LoginRequest, LoginResponse } from '@/types';

const config: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
};

class AuthApiClient {
  private readonly baseURL: string;
  private readonly timeout: number;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useBackendDirectly = false
  ): Promise<T> {
    // Choose between Next.js API route or direct backend call
    const baseUrl = useBackendDirectly ? this.baseURL : '';
    const url = `${baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use direct backend call for login
    return this.request<LoginResponse>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      true
    );
  }

  async logout(): Promise<void> {
    // Use direct backend call for logout
    return this.request<void>(
      '/api/auth/logout',
      {
        method: 'POST',
      },
      true
    );
  }

  async validateToken(): Promise<{ valid: boolean }> {
    try {
      // Use direct backend call for token validation

      return await this.request<{ valid: boolean }>(
        '/api/auth/validate',
        {
          method: 'GET',
        },
        true // Call backend directly
      );
    } catch (error) {
      console.error('Token validation failed:', error);
      return { valid: false };
    }
  }

  // Token management methods remain the same
  getStoredToken(): string | null {
    if (typeof globalThis !== 'undefined') {
      try {
        return localStorage.getItem('auth_token');
      } catch (error) {
        console.error('Error getting token from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof globalThis !== 'undefined') {
      try {
        localStorage.setItem('auth_token', token);
      } catch (error) {
        console.error('Error storing token in localStorage:', error);
      }
    }
  }

  setRefreshToken(token: string): void {
    if (typeof globalThis !== 'undefined') {
      try {
        localStorage.setItem('refresh_token', token);
      } catch (error) {
        console.error('Error storing refresh token in localStorage:', error);
      }
    }
  }

  getRefreshToken(): string | null {
    if (typeof globalThis !== 'undefined') {
      try {
        return localStorage.getItem('refresh_token');
      } catch (error) {
        console.error('Error getting refresh token from localStorage:', error);
        return null;
      }
    }
    return null;
  }

  removeTokens(): void {
    if (typeof globalThis !== 'undefined') {
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      } catch (error) {
        console.error('Error removing tokens from localStorage:', error);
      }
    }
  }
}

export const authApiClient = new AuthApiClient(config);
