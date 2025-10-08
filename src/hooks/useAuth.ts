// src/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApiClient } from '@/api/authApi';
import type { LoginRequest, AuthState } from '@/types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  const setError = useCallback((error: string | null) => {
    setAuthState((prev) => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setAuthState((prev) => ({ ...prev, isLoading }));
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = authApiClient.getStoredToken();
      if (!token) {
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      const { valid } = await authApiClient.validateToken();

      if (valid) {
        setAuthState({
          isLoggedIn: true,
          user: { id: 'user' }, // Simple user object since backend doesn't provide user details
          isLoading: false,
          error: null,
        });
      } else {
        authApiClient.removeTokens();
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authApiClient.removeTokens();
      setAuthState({
        isLoggedIn: false,
        user: null,
        isLoading: false,
        error: null,
      });
    }
  }, [setLoading, setError]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authApiClient.login(credentials);

        if (response.status === 200 && response.data) {
          authApiClient.setToken(response.data.accessToken);
          authApiClient.setRefreshToken(response.data.refreshToken);

          setAuthState({
            isLoggedIn: true,
            user: { id: 'user' },
            isLoading: false,
            error: null,
          });

          return { success: true, user: { id: 'user' } };
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed';
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [setLoading, setError]
  );

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authApiClient.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    authApiClient.removeTokens();
    setAuthState({
      isLoggedIn: false,
      user: null,
      isLoading: false,
      error: null,
    });

    router.push('/');
  }, [router, setLoading]);

  const redirectIfLoggedIn = useCallback(
    (redirectTo: string = '/') => {
      if (authState.isLoggedIn && !authState.isLoading) {
        router.replace(redirectTo);
      }
    },
    [authState.isLoggedIn, authState.isLoading, router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
    redirectIfLoggedIn,
    clearError,
  };
};
