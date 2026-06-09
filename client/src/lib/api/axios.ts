import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

interface FailedRequestQueueItem {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: FailedRequestQueueItem[] = [];

/** Auth routes that return 401 for invalid credentials — must not trigger token refresh */
const AUTH_NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

const isAuthNoRefreshRequest = (url?: string): boolean => {
  if (!url) return false;
  return AUTH_NO_REFRESH_PATHS.some((path) => url.includes(path));
};

/**
 * Iterates through and processes the queue of stalled requests.
 */
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else if (token) {
      item.resolve(token);
    }
  });
  failedQueue = [];
};

// ─────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Attach access token automatically if present in client memory
// ─────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Automatically handles 401 token refresh queue rotations
// ─────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Skip refresh for auth endpoints (login 401 = bad credentials, not expired token)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthNoRefreshRequest(originalRequest.url)
    ) {
      if (isRefreshing) {
        // If rotation is already in flight, queue this request
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token rotation (uses httpOnly refresh token cookie automatically)
        const response = await axios.post<{ success: boolean; data: { accessToken: string } }>(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.data.accessToken;

        // Update state store
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Resume all queued up concurrent requests
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError: unknown) {
        // If token rotation fails, flush queue and wipe out active memory session
        const axiosErr = refreshError as AxiosError;
        processQueue(axiosErr, null);
        useAuthStore.getState().logout();
        // Reject with the original request error (e.g. expired token on /me), not the refresh failure
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.data?.code === "TOKEN_EXPIRED") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);