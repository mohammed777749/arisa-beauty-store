import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CardBrand = "visa" | "mastercard" | "mada" | "amex";

export type Card = {
  id: string;
  brand: CardBrand;
  last4: string;
  name: string;
  expiry: string; // MM/YY
  isDefault: boolean;
};

type PaymentsState = {
  cards: Card[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  addCard: (c: Omit<Card, "id" | "isDefault"> & { isDefault?: boolean }) => Card;
  removeCard: (id: string) => void;
  setDefault: (id: string) => void;
  getDefault: () => Card | undefined;
};

function genId() {
  return `card_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function detectBrand(numberDigits: string): CardBrand {
  const n = numberDigits.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^(9682|440|450|454|456|457|458|460|462|463|465|467|468|470|471|473|476|477|479|481|483|486|487|488|489|490|491|493|495|497|499)/.test(n)) {
    return "mada";
  }
  if (/^3[47]/.test(n)) return "amex";
  return "visa";
}

export const usePayments = create<PaymentsState>()(
  persist(
    (set, get) => ({
      cards: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      addCard: (c) => {
        const id = genId();
        const willBeDefault = c.isDefault ?? get().cards.length === 0;
        const newCard: Card = {
          ...c,
          id,
          isDefault: willBeDefault,
        };
        const cards = willBeDefault
          ? get().cards.map((x) => ({ ...x, isDefault: false }))
          : get().cards.slice();
        set({ cards: [...cards, newCard] });
        return newCard;
      },
      removeCard: (id) => {
        const cards = get().cards.filter((c) => c.id !== id);
        if (cards.length > 0 && !cards.some((c) => c.isDefault)) {
          cards[0].isDefault = true;
        }
        set({ cards });
      },
      setDefault: (id) => {
        set({
          cards: get().cards.map((c) => ({
            ...c,
            isDefault: c.id === id,
          })),
        });
      },
      getDefault: () => get().cards.find((c) => c.isDefault) ?? get().cards[0],
    }),
    {
      name: "glamour-payments",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
