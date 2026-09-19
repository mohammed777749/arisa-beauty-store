import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  id: string;
  name: string;
  phone: string;
  city: string;
  district: string;
  details: string;
  landmark?: string;
  notes?: string;
  isDefault: boolean;
};

type AddressesState = {
  addresses: Address[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  addAddress: (a: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }) => Address;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
  getDefault: () => Address | undefined;
  updateAddress: (id: string, patch: Partial<Address>) => void;
};

function genId() {
  return `addr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useAddresses = create<AddressesState>()(
  persist(
    (set, get) => ({
      addresses: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      addAddress: (a) => {
        const id = genId();
        const willBeDefault = a.isDefault ?? get().addresses.length === 0;
        const newAddr: Address = {
          ...a,
          id,
          isDefault: willBeDefault,
        };
        const addresses = willBeDefault
          ? get().addresses.map((x) => ({ ...x, isDefault: false }))
          : get().addresses.slice();
        set({ addresses: [...addresses, newAddr] });
        return newAddr;
      },
      removeAddress: (id) => {
        const addresses = get().addresses.filter((a) => a.id !== id);
        if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
          addresses[0].isDefault = true;
        }
        set({ addresses });
      },
      setDefault: (id) => {
        set({
          addresses: get().addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        });
      },
      getDefault: () => get().addresses.find((a) => a.isDefault) ?? get().addresses[0],
      updateAddress: (id, patch) => {
        set({
          addresses: get().addresses.map((a) =>
            a.id === id ? { ...a, ...patch } : a
          ),
        });
      },
    }),
    {
      name: "glamour-addresses",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
