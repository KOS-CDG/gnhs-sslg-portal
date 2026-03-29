import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppUser } from '@/types';

interface AuthState {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
}

/**
 * Lightweight persistence of the user object so pages don't flash on refresh.
 * The real source of truth is always AuthContext / Firebase.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'sslg-auth' }
  )
);
