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
  isMergingGuestItems: boolean;
  addGuestItem: (item: CartItem) => void;
  updateGuestItem: (productId: string, quantity: number) => void;
  removeGuestItem: (productId: string) => void;
  mergeGuestItems: (syncItem: (item: CartItem) => Promise<unknown> | unknown) => Promise<void>;
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
      isMergingGuestItems: false,
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
      removeGuestItem: (productId: string) => set({ guestItems: get().guestItems.filter(i => i.product.id !== productId) }),
      mergeGuestItems: async (syncItem) => {
        const items = get().guestItems;

        if (!items.length || get().isMergingGuestItems) return;

        set({ isMergingGuestItems: true });

        try {
          await Promise.all(items.map((item) => Promise.resolve(syncItem(item))));
          set({ guestItems: [], isMergingGuestItems: false });
        } catch (error) {
          set({ isMergingGuestItems: false });
          throw error;
        }
      }
    }),
  {
    name: "guest-cart",
    partialize: (state) => ({ guestItems: state.guestItems })
  })
);
