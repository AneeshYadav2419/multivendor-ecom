import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (productId: string) => boolean;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const exists = get().ids.includes(productId);
        set({
          ids: exists
            ? get().ids.filter((id) => id !== productId)
            : [...get().ids, productId],
        });
        return !exists;
      },
      has: (productId) => get().ids.includes(productId),
    }),
    { name: "auramarket-wishlist" }
  )
);
