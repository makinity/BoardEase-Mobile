import { create } from 'zustand';

import type { Property } from '@/types';

type PropertyStore = {
  properties: Property[];
  selected: Property | null;
  setProperties: (items: Property[]) => void;
  setSelected: (item: Property | null) => void;
  clear: () => void;
};

export const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [],
  selected: null,
  setProperties: (items) => set({ properties: items }),
  setSelected: (item) => set({ selected: item }),
  clear: () => set({ properties: [], selected: null }),
}));
