export interface UserLogin {
  id: number;
  sub: string;
  email: string;
  role?: string;
  exp?: number;
  iat?: number 
}

export interface AuthState {
  isLoggedIn: boolean;
  user: UserLogin | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}
