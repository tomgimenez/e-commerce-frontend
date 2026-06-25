import { create } from "zustand";

interface CheckoutStore {
  shippingMethodId: number | null;
  setShippingMethodId: (id: number) => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  shippingMethodId: null,
  setShippingMethodId: (id) => set({ shippingMethodId: id }),
}));