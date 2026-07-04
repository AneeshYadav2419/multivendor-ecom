

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

      setAccessToken: (accessToken) => {
        set({ accessToken });
        if (typeof window !== "undefined") {
          if (accessToken) {
            // Set cookie for Edge Middleware access
            document.cookie = `auramarket-session=${accessToken}; path=/; max-age=86400; SameSite=Strict; Secure`;
          } else {
            document.cookie = "auramarket-session=; path=/; max-age=0; SameSite=Strict; Secure";
          }
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
        });
        if (typeof window !== "undefined") {
          document.cookie = "auramarket-session=; path=/; max-age=0; SameSite=Strict; Secure";
        }
      },
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