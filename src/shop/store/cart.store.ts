import type { CartItem } from "@/interfaces/cart.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware"

interface CartStore {
  // drawer
  lastAdded: { title: string; } | null;
  isDrawerOpen: boolean;
  openDrawer: (item: { title: string; }) => void;
  closeDrawer: () => void;

  // guest cart
  guestItems: CartItem[];
  addGuestItem: (item: CartItem) => void;
  updateGuestItem: (productId: string, quantity: number) => void;
  removeGuestItem: (productId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      lastAdded: null,
      isDrawerOpen: false,
      openDrawer: (item) => set({ isDrawerOpen: true, lastAdded: item }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      // Guest Cart
      guestItems: [],
      addGuestItem: (item) => {
        const existing = get().guestItems.find(i => i.product.id === item.product.id);
        if (existing) {
          set({ guestItems: get().guestItems.map(i =>
            i.product.id === item.product.id
              ? {...i, quantity: i.quantity + item.quantity}
              : i 
          )})
        } else {
          set({ guestItems: [...get().guestItems, {...item, id: crypto.randomUUID()}] })
        }
      },
      updateGuestItem: (productId, quantity) => 
        set({ guestItems: get().guestItems.map( i =>
          i.product.id === productId ? { ...i, quantity } : i
        )}),
      removeGuestItem: (productId: string) => set({ guestItems: get().guestItems.filter(i => i.product.id !== productId) })
    }),
  {
    name: "guest-cart",
    partialize: (state) => ({ guestItems: state.guestItems })
  })
);
