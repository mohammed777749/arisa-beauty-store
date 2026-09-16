import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  items: string[]; // product IDs
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      toggle: (productId) => {
        const items = get().items;
        if (items.includes(productId)) {
          set({ items: items.filter((i) => i !== productId) });
        } else {
          set({ items: [...items, productId] });
        }
      },
      remove: (productId) => {
        set({ items: get().items.filter((i) => i !== productId) });
      },
      clear: () => set({ items: [] }),
      has: (productId) => get().items.includes(productId),
    }),
    {
      name: "glamour-wishlist",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
