import { create } from "zustand";

type UIState = {
    isCartOpen: boolean;
    setCartOpen: (value: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
    isCartOpen: false,
    setCartOpen: (value) => set({ isCartOpen: value }),
}));