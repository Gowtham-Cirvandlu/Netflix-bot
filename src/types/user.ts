export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  created_at: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  gender?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}