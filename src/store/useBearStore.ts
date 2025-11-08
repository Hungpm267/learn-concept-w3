import { create } from "zustand";

type BearState = {
  bears: number;
  increaseBear: () => void;
  decreaseBear: () => void;
  removeAllBears: () => void;
};

export const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increaseBear: () => set((state) => ({ bears: state.bears + 1 })),
  decreaseBear: () => set((state) => ({ bears: state.bears - 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
