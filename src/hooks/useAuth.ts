// src/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, LoginRequest } from '@/types';

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
      const token = apiClient.getStoredToken();
      if (!token) {
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      const { valid } = await apiClient.validateToken();

      if (valid) {
        setAuthState({
          isLoggedIn: true,
          user: { id: 'user' },
          isLoading: false,
          error: null,
        });
      } else {
        apiClient.removeTokens();
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.removeTokens();
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
        const response = await apiClient.login(credentials);

        if (response.status === 200 && response.data) {
          apiClient.setToken(response.data.accessToken);
          apiClient.setRefreshToken(response.data.refreshToken);

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
      await apiClient.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }

    apiClient.removeTokens();
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
