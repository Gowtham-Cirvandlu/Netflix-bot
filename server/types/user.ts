export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  password_hash: string;
  subscription_status: string;
  created_at: string;
}

export interface UserResponse {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  subscription_status: string;
  created_at: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
}
