import { create } from "zustand";
import { persist } from "zustand/middleware";

// Customer authentication store (client-side, persisted to localStorage).
// Simple demo-grade auth: registered users are stored locally so login works
// across sessions in the same browser.

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string; // simple hash
  createdAt: string;
};

type CustomerAuthState = {
  // All registered users (local "database")
  users: Customer[];
  // Currently logged-in user (without password hash)
  current: Omit<Customer, "passwordHash"> | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  // Register a new user. Returns {ok, error?}
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => { ok: boolean; error?: string };
  // Login with email + password
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  // Update profile
  updateProfile: (data: { name?: string; phone?: string }) => void;
};

function simpleHash(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function genId() {
  return "cust_" + Math.random().toString(36).slice(2, 11);
}

function toPublic(u: Customer): Omit<Customer, "passwordHash"> {
  const { passwordHash: _ph, ...rest } = u;
  return rest;
}

export const useCustomerAuth = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      users: [],
      current: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      register: ({ name, email, phone, password }) => {
        const e = email.trim().toLowerCase();
        if (!name.trim() || !e || !phone.trim() || !password) {
          return { ok: false, error: "جميع الحقول مطلوبة" };
        }
        if (password.length < 6) {
          return { ok: false, error: "كلمة السر يجب أن تكون ٦ أحرف على الأقل" };
        }
        const exists = get().users.some((u) => u.email === e);
        if (exists) {
          return { ok: false, error: "هذا البريد مسجّل بالفعل" };
        }
        const user: Customer = {
          id: genId(),
          name: name.trim(),
          email: e,
          phone: phone.trim(),
          passwordHash: simpleHash("cust:" + password),
          createdAt: new Date().toISOString(),
        };
        set({
          users: [...get().users, user],
          current: toPublic(user),
          isAuthenticated: true,
        });
        return { ok: true };
      },
      login: (email, password) => {
        const e = email.trim().toLowerCase();
        const user = get().users.find((u) => u.email === e);
        if (!user) {
          return { ok: false, error: "البريد غير مسجّل" };
        }
        if (user.passwordHash !== simpleHash("cust:" + password)) {
          return { ok: false, error: "كلمة السر غير صحيحة" };
        }
        set({ current: toPublic(user), isAuthenticated: true });
        return { ok: true };
      },
      logout: () => set({ current: null, isAuthenticated: false }),
      updateProfile: (data) => {
        const c = get().current;
        if (!c) return;
        const updated = { ...c, ...data };
        // Also update in users list
        const users = get().users.map((u) =>
          u.id === c.id ? { ...u, ...data } : u
        );
        set({ current: updated, users });
      },
    }),
    {
      name: "glamour-customer-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
