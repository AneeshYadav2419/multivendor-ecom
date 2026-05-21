import { api } from "@/lib/api/axios";
import { LoginFormValues, RegisterFormValues } from "@/features/auth/validations/auth-schemas";
import { AuthResponse, RegisterResponse } from "@/features/auth/types";

export const loginUser = async (data: LoginFormValues): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const registerUser = async (data: RegisterFormValues): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/auth/register", data);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const refreshAccessToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};