// import { useMutation } from "@tanstack/react-query";
// import { AxiosError } from "axios";
// import { toast } from "sonner";
// import { loginUser, registerUser, logoutUser } from "@/lib/api/auth";
// import { useAuthStore, AuthUser } from "@/store/useAuthStore";
// import { LoginFormValues, RegisterFormValues } from "../validations/auth-schemas";
// import { AuthResponse, RegisterResponse } from "../types";

// interface ApiErrorResponse {
//   message?: string;
// }

// /**
//  * Hook for executing login requests.
//  * Automatically manages access tokens, updates state store, and triggers toasts.
//  */
// export const useLoginMutation = (options?: {
//   onSuccess?: (user: AuthUser, accessToken: string) => void;
//   onError?: (error: string) => void;
// }) => {
//   const setAccessToken = useAuthStore((state) => state.setAccessToken);
//   const setUser = useAuthStore((state) => state.setUser);

//   return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, LoginFormValues>({
//     mutationFn: loginUser,

//     onSuccess: (response) => {
//       const { accessToken, user } = response.data;

//       // ✅ update Zustand store
//       setAccessToken(accessToken);
//       setUser(user);

//       // ✅ persist login
//       localStorage.setItem("token", accessToken);
//       localStorage.setItem("user", JSON.stringify(user));

//       toast.success("Welcome back! Login successful.");

//       // optional callback from component
//       options?.onSuccess?.(user, accessToken);
//     },

//     onError: (error) => {
//       const errMsg =
//         error.response?.data?.message || "Invalid credentials. Please try again.";

//       toast.error(errMsg);
//       options?.onError?.(errMsg);
//     },
//   });
// };

// /**
//  * Hook for executing registration requests.
//  * Directs new customers and vendors to the login page after sign-up.
//  */
// export const useRegisterMutation = (options?: {
//   onSuccess?: (response: RegisterResponse) => void;
//   onError?: (error: string) => void;
// }) => {
//   return useMutation<RegisterResponse, AxiosError<ApiErrorResponse>, RegisterFormValues>({
//     mutationFn: registerUser,
//     onSuccess: (response) => {
//       const user = response.data?.user;

//       if (user?.role === "VENDOR") {
//         toast.success("Vendor profile submitted! Awaiting administrator approval.");
//       } else {
//         toast.success("Account created successfully! Please sign in.");
//       }

//       if (options?.onSuccess) {
//         options.onSuccess(response);
//       }
//     },
//     onError: (error) => {
//       const errMsg = error.response?.data?.message || "Registration failed. Please check your details.";
//       toast.error(errMsg);

//       if (options?.onError) {
//         options.onError(errMsg);
//       }
//     },
//   });
// };

// /**
//  * Hook for executing logout requests.
//  * Destroys active persistent cookies and state store sessions.
//  */
// export const useLogoutMutation = (options?: {
//   onSuccess?: () => void;
// }) => {
//   const logout = useAuthStore((state) => state.logout);

//   return useMutation<void, AxiosError<ApiErrorResponse>, void>({
//     mutationFn: logoutUser,
//     onSuccess: () => {
//       logout();
//       toast.success("Session closed. You have logged out.");
//       if (options?.onSuccess) {
//         options.onSuccess();
//       }
//     },
//     onError: () => {
//       // Safe fallback logout on server connection drops
//       logout();
//       if (options?.onSuccess) {
//         options.onSuccess();
//       }
//     },
//   });
// };
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { loginUser, registerUser, logoutUser } from "@/lib/api/auth";
import { useAuthStore, AuthUser } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { LoginFormValues, RegisterFormValues } from "../validations/auth-schemas";
import { AuthResponse, RegisterResponse } from "../types";

interface ApiErrorResponse {
  message?: string;
}

/**
 * Hook for executing login requests.
 * Automatically manages access tokens, updates state store, and triggers toasts.
 */
export const useLoginMutation = (options?: {
  onSuccess?: (user: AuthUser, accessToken: string) => void;
  onError?: (error: string) => void;
}) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const mergeOnLogin = useWishlistStore((state) => state.mergeOnLogin);

  return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, LoginFormValues>({
    mutationFn: loginUser,

    onSuccess: async (response) => {
      const { accessToken, user } = response.data;

      // ✅ update Zustand store
      setAccessToken(accessToken);
      setUser(user);

      // ✅ persist login
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ merge any guest wishlist into the server wishlist
      // Runs after the token is set, since the merge API call needs auth.
      // Non-blocking failure — login should never fail because of this.
      try {
        await mergeOnLogin();
      } catch {
        // Wishlist merge failing shouldn't block login or show an error toast —
        // it's a background sync, not a critical part of the auth flow.
      }

      toast.success("Welcome back! Login successful.");

      // optional callback from component
      options?.onSuccess?.(user, accessToken);
    },

    onError: (error) => {
      const errMsg =
        error.response?.data?.message || "Invalid credentials. Please try again.";

      toast.error(errMsg);
      options?.onError?.(errMsg);
    },
  });
};

/**
 * Hook for executing registration requests.
 * Directs new customers and vendors to the login page after sign-up.
 */
export const useRegisterMutation = (options?: {
  onSuccess?: (response: RegisterResponse) => void;
  onError?: (error: string) => void;
}) => {
  return useMutation<RegisterResponse, AxiosError<ApiErrorResponse>, RegisterFormValues>({
    mutationFn: registerUser,
    onSuccess: (response) => {
      const user = response.data?.user;

      if (user?.role === "VENDOR") {
        toast.success("Vendor profile submitted! Awaiting administrator approval.");
      } else {
        toast.success("Account created successfully! Please sign in.");
      }

      if (options?.onSuccess) {
        options.onSuccess(response);
      }
    },
    onError: (error) => {
      const errMsg = error.response?.data?.message || "Registration failed. Please check your details.";
      toast.error(errMsg);

      if (options?.onError) {
        options.onError(errMsg);
      }
    },
  });
};

/**
 * Hook for executing logout requests.
 * Destroys active persistent cookies and state store sessions.
 */
export const useLogoutMutation = (options?: {
  onSuccess?: () => void;
}) => {
  const logout = useAuthStore((state) => state.logout);
  const clearWishlist = useWishlistStore((state) => state.clearLocal);

  return useMutation<void, AxiosError<ApiErrorResponse>, void>({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      clearWishlist();
      toast.success("Session closed. You have logged out.");
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: () => {
      // Safe fallback logout on server connection drops
      logout();
      clearWishlist();
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};