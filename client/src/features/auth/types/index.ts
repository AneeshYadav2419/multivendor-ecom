import { AuthUser } from "@/store/useAuthStore";

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  data: {
    user: AuthUser;
  };
}
