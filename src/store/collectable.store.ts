import { create } from 'zustand';

type Collectable = {
  id: string;
  rentalId: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
};

type CollectableStore = {
  collectables: Collectable[];
  setCollectables: (items: Collectable[]) => void;
  clear: () => void;
};

export const useCollectableStore = create<CollectableStore>((set) => ({
  collectables: [],
  setCollectables: (items) => set({ collectables: items }),
  clear: () => set({ collectables: [] }),
}));
