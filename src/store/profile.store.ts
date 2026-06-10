import { create } from 'zustand';

import type { User } from '@/types';

type ProfileStore = {
  profile: User | null;
  setProfile: (profile: User) => void;
  clear: () => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clear: () => set({ profile: null }),
}));
