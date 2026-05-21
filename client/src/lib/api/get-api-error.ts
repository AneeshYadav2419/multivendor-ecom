import { AxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
  code?: string;
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined;
    if (data?.message) return data.message;
    if (error.code === "ERR_NETWORK") {
      return "Cannot reach API. Is the server running on port 5000?";
    }
    if (error.response?.status === 404) return "Resource not found.";
  }
  if (error instanceof Error) return error.message;
  return fallback;
};
