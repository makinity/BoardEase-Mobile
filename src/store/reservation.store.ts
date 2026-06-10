import { create } from 'zustand';

import type { Reservation } from '@/types';

type ReservationStore = {
  reservations: Reservation[];
  setReservations: (items: Reservation[]) => void;
  clear: () => void;
};

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],
  setReservations: (items) => set({ reservations: items }),
  clear: () => set({ reservations: [] }),
}));
