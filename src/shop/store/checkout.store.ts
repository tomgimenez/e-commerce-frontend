import { create } from "zustand";

interface CheckoutStore {
  shippingMethodId: number | null;
  setShippingMethodId: (id: number) => void;
  addressId: string | null;
  setAddressId: (id: string) => void;
  paymentMethod: string | null;
  setPaymentMethod: (method: string) => void;
  clear: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  shippingMethodId: null,
  setShippingMethodId: (id) => set({ shippingMethodId: id }),
  addressId: null,
  setAddressId: (id) => set({ addressId: id }),
  paymentMethod: null,
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  clear: () => set({ shippingMethodId: null, addressId: null, paymentMethod: null })
}));