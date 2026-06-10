import { create } from 'zustand';

import type { Rental } from '@/types';

type RentalStore = {
  rentals: Rental[];
  activeRental: Rental | null;
  setRentals: (items: Rental[]) => void;
  setActiveRental: (item: Rental | null) => void;
  clear: () => void;
};

export const useRentalStore = create<RentalStore>((set) => ({
  rentals: [],
  activeRental: null,
  setRentals: (items) => set({ rentals: items }),
  setActiveRental: (item) => set({ activeRental: item }),
  clear: () => set({ rentals: [], activeRental: null }),
}));
