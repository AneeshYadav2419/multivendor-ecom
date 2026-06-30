// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface WishlistState {
//   ids: string[];
//   toggle: (productId: string) => boolean;
//   has: (productId: string) => boolean;
// }

// export const useWishlistStore = create<WishlistState>()(
//   persist(
//     (set, get) => ({
//       ids: [],
//       toggle: (productId) => {
//         const exists = get().ids.includes(productId);
//         set({
//           ids: exists
//             ? get().ids.filter((id) => id !== productId)
//             : [...get().ids, productId],
//         });
//         return !exists;
//       },
//       has: (productId) => get().ids.includes(productId),
//     }),
//     { name: "auramarket-wishlist" }
//   )
// );
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/store/useAuthStore";
import {
  toggleWishlistItem as toggleWishlistApi,
  removeWishlistItem as removeWishlistApi,
  mergeWishlist as mergeWishlistApi,
  getWishlist as getWishlistApi,
} from "@/lib/api/wishlist.api";

interface WishlistState {
  ids: string[];
  isSyncing: boolean;
  toggle: (productId: string) => Promise<boolean>;
  remove: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
  syncFromServer: () => Promise<void>;
  mergeOnLogin: () => Promise<void>;
  clearLocal: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      isSyncing: false,

      /**
       * Toggle a product in the wishlist.
       *
       * Guest: writes only to localStorage (handled by persist middleware).
       * Logged-in: optimistic local update first (instant UI feedback),
       * then confirms with the backend. On API failure, the local state
       * is rolled back so it never drifts from the server.
       */
      toggle: async (productId: string) => {
        const exists = get().ids.includes(productId);
        const isLoggedIn = !!useAuthStore.getState().accessToken;

        set({
          ids: exists
            ? get().ids.filter((id) => id !== productId)
            : [...get().ids, productId],
        });

        if (!isLoggedIn) {
          return !exists;
        }

        try {
          const added = await toggleWishlistApi(productId);
          return added;
        } catch (error) {
          set({
            ids: exists
              ? [...get().ids, productId]
              : get().ids.filter((id) => id !== productId),
          });
          throw error;
        }
      },

      /**
       * Explicitly remove a product (used by the wishlist page's delete button,
       * as opposed to toggle which is used by heart icons on product cards).
       *
       * This is the single source of truth for "remove" — any screen that
       * deletes a wishlist item should call this, not the raw API client
       * directly, so `ids` never drifts from what the backend has.
       */
      remove: async (productId: string) => {
        const wasPresent = get().ids.includes(productId);
        const isLoggedIn = !!useAuthStore.getState().accessToken;

        // Optimistic local removal
        set({ ids: get().ids.filter((id) => id !== productId) });

        if (!isLoggedIn) {
          return;
        }

        try {
          await removeWishlistApi(productId);
        } catch (error) {
          // Roll back if the backend call fails
          if (wasPresent) {
            set({ ids: [...get().ids, productId] });
          }
          throw error;
        }
      },

      has: (productId: string) => get().ids.includes(productId),

      syncFromServer: async () => {
        set({ isSyncing: true });
        try {
          const wishlist = await getWishlistApi();
          set({
            ids: wishlist.items.map((item) => item.productId),
          });
        } finally {
          set({ isSyncing: false });
        }
      },

      mergeOnLogin: async () => {
        const localIds = get().ids;
        set({ isSyncing: true });
        try {
          const merged = await mergeWishlistApi(localIds);
          set({
            ids: merged.items.map((item) => item.productId),
          });
        } finally {
          set({ isSyncing: false });
        }
      },

      clearLocal: () => {
        set({ ids: [] });
      },
    }),
    { name: "auramarket-wishlist" }
  )
);