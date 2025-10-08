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
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
