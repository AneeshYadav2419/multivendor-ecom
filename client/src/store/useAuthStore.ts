import { create } from "zustand";

type User = {
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "VENDOR" | "ADMIN";
};

type AuthState = {
    user: User | null;
    accessToken: string | null;

    setUser: (user: User | null) => void;

    setAccessToken: (token: string | null) => void;

    login: (user: User, token: string) => void;

    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,

    accessToken: null,

    setUser: (user) => set({ user }),

    setAccessToken: (token) =>
        set({ accessToken: token }),

    login: (user, token) =>
        set({
            user,
            accessToken: token,
        }),

    logout: () =>
        set({
            user: null,
            accessToken: null,
        }),
}));