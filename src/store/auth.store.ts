import { create } from 'zustand';

import type { UserRole } from '@/types';

type AuthStore = {
  role: UserRole | null;
  userId: string | null;
  setAuth: (userId: string, role: UserRole) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  role: null,
  userId: null,
  setAuth: (userId, role) => set({ userId, role }),
  clearAuth: () => set({ userId: null, role: null }),
}));
