import { create } from 'zustand';

import type { Payment } from '@/types';

type PaymentStore = {
  payments: Payment[];
  setPayments: (items: Payment[]) => void;
  clear: () => void;
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  setPayments: (items) => set({ payments: items }),
  clear: () => set({ payments: [] }),
}));
