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
import { decodeAccessTokenUser, isExpired } from '@/utils';
import type { LoginRequest, AuthState, UserLogin } from '@/types';

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

    // No token: clearly not logged in
    if (!token) {
      const nextState: AuthState = {
        isLoggedIn: false,
        user: null,
        isLoading: false,
        error: null,
      };
      setAuthState(nextState);
      writeSnapshot({ isLoggedIn: nextState.isLoggedIn, user: nextState.user });
      return;
    }

    // Try to decode user quickly from existing token
    const decoded = decodeAccessTokenUser(token);

    // Token present and decodable
    if (decoded) {
      // If NOT expired, mark logged in and stop loading
      if (!isExpired(decoded.exp)) {
        const nextState: AuthState = {
          isLoggedIn: true,
          user: decoded,
          isLoading: false,
          error: null,
        };
        setAuthState(nextState);
        writeSnapshot({ isLoggedIn: nextState.isLoggedIn, user: nextState.user });
        return;
      }

      // Expired: attempt refresh
      try {
        const refreshed = await authApiClient.refresh();
        authApiClient.setToken(refreshed.accessToken);
        const freshUser = decodeAccessTokenUser(refreshed.accessToken);
        const nextState: AuthState = {
          isLoggedIn: !!freshUser,
          user: freshUser ?? null,
          isLoading: false,
          error: null,
        };
        setAuthState(nextState);
        writeSnapshot({ isLoggedIn: nextState.isLoggedIn, user: nextState.user });
        return;
      } catch {
        // Refresh failed: clear tokens and mark logged out
        authApiClient.removeTokens();
        setAuthState({
          isLoggedIn: false,
          user: null,
          isLoading: false,
          error: null,
        });
        writeSnapshot({ isLoggedIn: false, user: null });
        return;
      }
    }

    // Token existed but couldn't decode: treat as logged out
    authApiClient.removeTokens();
    setAuthState({
      isLoggedIn: false,
      user: null,
      isLoading: false,
      error: null,
    });
    writeSnapshot({ isLoggedIn: false, user: null });
  }, [writeSnapshot]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      setError(null);

      try {
        const response = await authApiClient.login(credentials);

        if (response.status === 200 && response.data) {
          authApiClient.setToken(response.data.accessToken);
          authApiClient.setRefreshToken(response.data.refreshToken);

          // Prefer server-provided user; fallback to decode from token
          const serverUser = response.data.userLogin as UserLogin | undefined;
          const decodedUser = decodeAccessTokenUser(response.data.accessToken);
          const user = serverUser ?? decodedUser ?? null;

          const nextState: AuthState = {
            isLoggedIn: !!user,
            user,
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
        isLoading: true, 
        error: null,
      }));
    }

    void checkAuthStatus();
  }, [checkAuthStatus, readSnapshot]);

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
