// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// export interface AuthUser {
//   id: string;
//   name: string;
//   email: string;
//   role: "CUSTOMER" | "VENDOR" | "ADMIN";
//   createdAt: string;
// }

// interface AuthState {
//   user: AuthUser | null;
//   accessToken: string | null;
//   setUser: (user: AuthUser | null) => void;
//   setAccessToken: (token: string | null) => void;
//   logout: () => void;
// }

// // ─────────────────────────────────────────────────────────
// // Zustand Auth Store
// // Persists user session details safely in localStorage, 
// // leaving short-lived accessTokens in memory.
// // ─────────────────────────────────────────────────────────
// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       accessToken: null,

//       setUser: (user) => set({ user }),
//       setAccessToken: (accessToken) => set({ accessToken }),

//       logout: () => set({ user: null, accessToken: null }),
//     }),
//     {
//       name: "auramarket-auth-session",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         user: state.user,
//         accessToken: state.accessToken,
//       }),
//     }
//   )
// );

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;

  setUser: (user: AuthUser | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

/**
 * AUTH STORE (Single Source of Truth)
 * - Zustand manages auth state
 * - persist keeps session after refresh
 * - NO manual localStorage usage anywhere else
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setUser: (user) => set({ user }),

      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),
    }),
    {
      name: "auramarket-auth", // storage key

      storage: createJSONStorage(() => localStorage),

      // store BOTH user + token in one place
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);