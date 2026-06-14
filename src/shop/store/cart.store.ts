import { create } from "zustand";

interface CartStore {
  lastAdded: { title: string; } | null;
  isDrawerOpen: boolean;
  openDrawer: (item: { title: string; }) => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  lastAdded: null,
  isDrawerOpen: false,
  openDrawer: (item) => set({ isDrawerOpen: true, lastAdded: item }),
  closeDrawer: () => set({ isDrawerOpen: false })
}));
