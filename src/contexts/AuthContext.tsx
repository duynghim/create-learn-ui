'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { authApiClient } from '@/api/authApi';
import type { LoginRequest, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (
    credentials: LoginRequest
  ) => Promise<{ success: boolean; user: AuthState['user'] }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  redirectIfLoggedIn: (redirectTo?: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/** Type guard for errors that carry an HTTP status code */
function hasStatus(e: unknown): e is { status: number } {
  return (
    typeof e === 'object' &&
    e !== null &&
    'status' in e &&
    typeof (e as { status: unknown }).status === 'number'
  );
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isLoading: true,
    error: null,
  });

  const router = useRouter();

  // Prevent duplicate initialization in React 18 Strict Mode (dev)
  const initializedRef = useRef(false);

  // Snapshot to reduce UI flicker during refresh/HMR
  const SNAPSHOT_KEY = 'auth:snapshot';

  const writeSnapshot = useCallback(
    (s: Pick<AuthState, 'isLoggedIn' | 'user'>) => {
      try {
        sessionStorage.setItem(
          SNAPSHOT_KEY,
          JSON.stringify({ isLoggedIn: s.isLoggedIn, user: s.user })
        );
      } catch {
        // ignore storage errors (quota/SSR)
      }
    },
    []
  );

  const readSnapshot = useCallback((): Pick<
    AuthState,
    'isLoggedIn' | 'user'
  > | null => {
    try {
      const raw = sessionStorage.getItem(SNAPSHOT_KEY);
      return raw
        ? (JSON.parse(raw) as { isLoggedIn: boolean; user: AuthState['user'] })
        : null;
    } catch {
      return null;
    }
  }, []);

  const setError = useCallback((error: string | null) => {
    setAuthState((prev) => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setAuthState((prev) => ({ ...prev, isLoading }));
  }, []);

  const checkAuthStatus = useCallback(async () => {
    const token = authApiClient.getStoredToken();

    if (token) {
      // Token exists, assume valid until we get 401 from API calls
      const nextState: AuthState = {
        isLoggedIn: true,
        user: { id: 'user' },
        isLoading: false,
        error: null,
      };
      setAuthState(nextState);
      writeSnapshot({
        isLoggedIn: nextState.isLoggedIn,
        user: nextState.user,
      });
    } else {
      // No token, user is logged out
      const nextState: AuthState = {
        isLoggedIn: false,
        user: null,
        isLoading: false,
        error: null,
      };
      setAuthState(nextState);
      writeSnapshot({ isLoggedIn: nextState.isLoggedIn, user: nextState.user });
    }
  }, [writeSnapshot]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authApiClient.login(credentials);

        if (response.status === 200 && response.data) {
          // Store tokens
          authApiClient.setToken(response.data.accessToken);
          authApiClient.setRefreshToken(response.data.refreshToken);

          // Update auth state
          const nextState: AuthState = {
            isLoggedIn: true,
            user: { id: 'user' },
            isLoading: false,
            error: null,
          };
          setAuthState(nextState);
          writeSnapshot({
            isLoggedIn: nextState.isLoggedIn,
            user: nextState.user,
          });

          return { success: true, user: nextState.user };
        }

        throw new Error(
          (response as { message?: string })?.message ?? 'Login failed'
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed';
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error instanceof Error ? error : new Error(errorMessage);
      }
    },
    [setLoading, setError, writeSnapshot]
  );

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      await authApiClient.logout();
    } catch {
      // Ignore API failure during logout; we still clear local state.
    }

    authApiClient.removeTokens();
    const nextState: AuthState = {
      isLoggedIn: false,
      user: null,
      isLoading: false,
      error: null,
    };
    setAuthState(nextState);
    writeSnapshot({ isLoggedIn: nextState.isLoggedIn, user: nextState.user });

    router.push('/');
  }, [router, setLoading, writeSnapshot]);

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

  // On first client mount, try to hydrate quick from snapshot to avoid flicker,
  // then immediately verify with backend.
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const snap = readSnapshot();
    if (snap) {
      setAuthState((prev) => ({
        ...prev,
        isLoggedIn: snap.isLoggedIn,
        user: snap.user,
        isLoading: true, // we’ll still verify with backend
        error: null,
      }));
    }

    // Fire and forget; checkAuthStatus will set final state
    void checkAuthStatus();
  }, [checkAuthStatus, readSnapshot]);

  // Optional: debug state changes
  // useEffect(() => {
  //   console.log('Auth state changed:', authState);
  // }, [authState]);

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
