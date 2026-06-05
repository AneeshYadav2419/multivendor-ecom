import { create } from "zustand";

type UIState = {
    isCartOpen: boolean;
    setCartOpen: (value: boolean) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
    toggleSidebar: () => void;
};

export const useUIStore = create<UIState>((set) => ({
    isCartOpen: false,
    setCartOpen: (value) => set({ isCartOpen: value }),
    isSidebarOpen: true, // Default open on desktop
    setSidebarOpen: (value) => set({ isSidebarOpen: value }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));