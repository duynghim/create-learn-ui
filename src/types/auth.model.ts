import { UserLogin } from '@/types';
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  timestamp: string;
  data: {
    refreshToken: string;
    accessToken: string;
    userLogin: UserLogin;
  };
}

export interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: 'admin' | 'user';
}

export interface AuthState {
  isLoggedIn: boolean;
  user: UserLogin | null;
  isLoading: boolean;
  error: string | null;
}
