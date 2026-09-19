import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  shade?: string | null;
};

type CartState = {
  items: CartItem[];
  savedItems: CartItem[];
  isCartOpen: boolean;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, shade?: string | null) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    shade?: string | null
  ) => void;
  setQuantity: (
    productId: string,
    quantity: number,
    shade?: string | null
  ) => void;
  clearCart: () => void;
  saveForLater: (productId: string, shade?: string | null) => void;
  moveToCart: (productId: string, shade?: string | null) => void;
  removeSaved: (productId: string, shade?: string | null) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

const sameItem = (a: CartItem, b: { productId: string; shade?: string | null }) =>
  a.productId === b.productId && (a.shade ?? null) === (b.shade ?? null);

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      isCartOpen: false,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      addItem: (item) => {
        const items = get().items.slice();
        const quantity = item.quantity ?? 1;
        const idx = items.findIndex((i) =>
          sameItem(i, { productId: item.productId, shade: item.shade })
        );
        if (idx >= 0) {
          items[idx] = {
            ...items[idx],
            quantity: items[idx].quantity + quantity,
          };
        } else {
          items.push({ ...item, quantity });
        }
        set({ items });
      },
      removeItem: (productId, shade) => {
        set({
          items: get().items.filter(
            (i) => !sameItem(i, { productId, shade })
          ),
        });
      },
      updateQuantity: (productId, quantity, shade) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            sameItem(i, { productId, shade })
              ? { ...i, quantity }
              : i
          ),
        });
      },
      setQuantity: (productId, quantity, shade) => {
        if (quantity < 1) {
          set({
            items: get().items.filter(
              (i) => !sameItem(i, { productId, shade })
            ),
          });
          return;
        }
        set({
          items: get().items.map((i) =>
            sameItem(i, { productId, shade })
              ? { ...i, quantity }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      saveForLater: (productId, shade) => {
        const items = get().items;
        const target = items.find((i) => sameItem(i, { productId, shade }));
        if (!target) return;
        const savedItems = get().savedItems.slice();
        const sIdx = savedItems.findIndex((i) => sameItem(i, { productId, shade }));
        if (sIdx >= 0) {
          savedItems[sIdx] = { ...savedItems[sIdx], quantity: savedItems[sIdx].quantity + target.quantity };
        } else {
          savedItems.push({ ...target });
        }
        set({
          items: items.filter((i) => !sameItem(i, { productId, shade })),
          savedItems,
        });
      },
      moveToCart: (productId, shade) => {
        const savedItems = get().savedItems;
        const target = savedItems.find((i) => sameItem(i, { productId, shade }));
        if (!target) return;
        const items = get().items.slice();
        const idx = items.findIndex((i) => sameItem(i, { productId, shade }));
        if (idx >= 0) {
          items[idx] = { ...items[idx], quantity: items[idx].quantity + target.quantity };
        } else {
          items.push({ ...target });
        }
        set({
          items,
          savedItems: savedItems.filter((i) => !sameItem(i, { productId, shade })),
        });
      },
      removeSaved: (productId, shade) => {
        set({
          savedItems: get().savedItems.filter(
            (i) => !sameItem(i, { productId, shade })
          ),
        });
      },
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "glamour-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
