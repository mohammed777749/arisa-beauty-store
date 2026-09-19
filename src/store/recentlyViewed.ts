import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentlyViewedState = {
  items: string[]; // product IDs (most recent first, max 10)
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  add: (productId: string) => void;
  clear: () => void;
};

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      add: (productId) => {
        const items = get().items.filter((i) => i !== productId);
        set({ items: [productId, ...items].slice(0, 10) });
      },
      clear: () => set({ items: [] }),
    }),
    {
      name: "glamour-recently-viewed",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
