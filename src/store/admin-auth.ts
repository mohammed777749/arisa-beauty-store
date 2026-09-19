import { create } from "zustand";
import { persist } from "zustand/middleware";

// Admin auth store with password + session, persisted to localStorage.
// Password is stored hashed (simple hash — this is a demo, not production-grade).
// Default password is "admin1234".

function simpleHash(s: string): string {
  // FNV-1a inspired simple hash (non-crypto, demo only)
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function hashPassword(pw: string): string {
  // Double hash with salt for slightly better obfuscation
  return simpleHash("glam-salt:" + pw + ":v1");
}

type AdminAuthState = {
  // Hashed password (stored). Initialized to default on first run.
  passwordHash: string;
  // Whether admin is currently authenticated (session).
  isAuthenticated: boolean;
  // Whether the store has hydrated from localStorage.
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  // Verify a password against the stored hash.
  verify: (pw: string) => boolean;
  // Login: sets isAuthenticated true if password matches.
  login: (pw: string) => boolean;
  logout: () => void;
  // Change password: requires old password to match.
  changePassword: (oldPw: string, newPw: string) => boolean;
  // Reset password to default "admin1234".
  resetPassword: () => void;
};

const DEFAULT_PASSWORD = "admin1234";

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      passwordHash: hashPassword(DEFAULT_PASSWORD),
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      verify: (pw) => {
        return hashPassword(pw) === get().passwordHash;
      },
      login: (pw) => {
        if (hashPassword(pw) === get().passwordHash) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      changePassword: (oldPw, newPw) => {
        if (hashPassword(oldPw) !== get().passwordHash) return false;
        if (!newPw || newPw.length < 6) return false;
        set({ passwordHash: hashPassword(newPw) });
        return true;
      },
      resetPassword: () => set({ passwordHash: hashPassword(DEFAULT_PASSWORD) }),
    }),
    {
      name: "glamour-admin-auth",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export { DEFAULT_PASSWORD };
