'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authApiClient } from '@/api/authApi';
import type { LoginRequest, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginRequest
  ) => Promise<{ success: boolean; user: { id: string } }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  redirectIfLoggedIn: (redirectTo?: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
      console.log('Checking auth status, token:', token ? 'exists' : 'none');

      if (!token) {
        console.log('No token found, setting logged out');
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Validate token with backend
      const { valid } = await authApiClient.validateToken();
      console.log('Token validation result:', valid);

      if (valid) {
        console.log('Token valid, setting logged in');
        setAuthState({
          isLoggedIn: true,
          user: { id: 'user' },
          isLoading: false,
          error: null,
        });
      } else {
        console.log('Token invalid, removing and setting logged out');
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
        console.log('Attempting login...');
        const response = await authApiClient.login(credentials);

        if (response.status === 200 && response.data) {
          console.log('Login successful, storing tokens');

          // Store tokens
          authApiClient.setToken(response.data.accessToken);
          authApiClient.setRefreshToken(response.data.refreshToken);

          // Update auth state
          setAuthState({
            isLoggedIn: true,
            user: { id: 'user' },
            isLoading: false,
            error: null,
          });

          console.log('Auth state updated to logged in');
          return { success: true, user: { id: 'user' } };
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login failed:', error);
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
    console.log('Logging out...');
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

    console.log('Logged out, redirecting to home');
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

  // Check auth status on mount
  useEffect(() => {
    console.log('AuthProvider mounting, checking auth status');
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Debug logging
  useEffect(() => {
    console.log('Auth state changed:', authState);
  }, [authState]);

  const contextValue: AuthContextType = React.useMemo(
    () => ({
      ...authState,
      login,
      logout,
      checkAuthStatus,
      redirectIfLoggedIn,
      clearError,
    }),
    [authState, login, logout, checkAuthStatus, redirectIfLoggedIn, clearError]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
