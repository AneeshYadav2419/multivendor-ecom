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
  mergeWishlist as mergeWishlistApi,
  getWishlist as getWishlistApi,
} from "@/lib/api/wishlist.api";

interface WishlistState {
  ids: string[];
  isSyncing: boolean;
  toggle: (productId: string) => Promise<boolean>;
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

        // Optimistic update — applies to both guest and logged-in paths
        set({
          ids: exists
            ? get().ids.filter((id) => id !== productId)
            : [...get().ids, productId],
        });

        if (!isLoggedIn) {
          // Guest path stops here — localStorage is the source of truth
          return !exists;
        }

        // Logged-in path — confirm with backend
        try {
          const added = await toggleWishlistApi(productId);
          return added;
        } catch (error) {
          // Roll back the optimistic update on failure
          set({
            ids: exists
              ? [...get().ids, productId]
              : get().ids.filter((id) => id !== productId),
          });
          throw error;
        }
      },

      has: (productId: string) => get().ids.includes(productId),

      /**
       * Pull the authoritative wishlist from the server and overwrite local ids.
       * Call this after merge, or on app load if the user is already logged in.
       */
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

      /**
       * Runs once, immediately after login succeeds.
       * Sends whatever was in the guest's localStorage to the backend,
       * then overwrites local state with the merged server result.
       */
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

      /**
       * Call on logout — wipes the wishlist back to guest-empty state.
       * Prevents the next guest session on this device from inheriting
       * the previous user's wishlist.
       */
      clearLocal: () => {
        set({ ids: [] });
      },
    }),
    { name: "auramarket-wishlist" }
  )
);
