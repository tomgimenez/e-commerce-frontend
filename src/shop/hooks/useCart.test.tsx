import type { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useCart } from './useCart';
import * as cartApi from '../api/cart.api';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '@/auth/store/auth.store';
import type { CartItem } from '@/interfaces/cart.interface';
import type { Product } from '@/interfaces/product.interface';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('../api/cart.api', () => ({
  getCart: vi.fn(),
  addItem: vi.fn(),
  updateItem: vi.fn(),
  removeItem: vi.fn(),
}));

vi.mock('../store/cart.store', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('@/auth/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

// ── Setup ──────────────────────────────────────────────────────────────────

const mockCartItem: CartItem = {
  id: 'item-1',
  quantity: 2,
  unitPrice: 100,
  product: {
    id: 'product-1',
    title: 'Test Product',
    price: 100,
  } as any as Product,
};

const mockUserCart = {
  id: 'cart-1',
  updatedAt: new Date(),
  items: [mockCartItem],
};

const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const setupAuthenticatedUser = () => {
  vi.mocked(useAuthStore).mockReturnValue({
    authStatus: 'authenticated',
  } as any);

  vi.mocked(cartApi.getCart).mockResolvedValue(mockUserCart);
};

const setupGuestUser = () => {
  vi.mocked(useAuthStore).mockReturnValue({
    authStatus: 'unauthenticated',
  } as any);
};

const setupCartStore = (items: CartItem[] = []) => {
  vi.mocked(useCartStore).mockReturnValue({
    guestItems: items,
    addGuestItem: vi.fn(),
    updateGuestItem: vi.fn(),
    removeGuestItem: vi.fn(),
    mergeGuestItems: vi.fn().mockResolvedValue(undefined),
    lastAdded: null,
    isDrawerOpen: false,
    openDrawer: vi.fn(),
    closeDrawer: vi.fn(),
  } as any);
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authenticated User', () => {
    it('should fetch user cart when authenticated', async () => {
      setupAuthenticatedUser();
      setupCartStore();

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.cart).toBeDefined();
      });

      expect(cartApi.getCart).toHaveBeenCalled();
      expect(result.current.cart?.items).toEqual(mockUserCart.items);
    });

    it('should use user cart items instead of guest items', async () => {
      setupAuthenticatedUser();
      setupCartStore([mockCartItem]);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.cart?.items).toBeDefined();
      });

      expect(result.current.cart?.items).toEqual(mockUserCart.items);
    });

    it('should merge guest cart items into the authenticated cart on login', async () => {
      setupAuthenticatedUser();
      const mergeGuestItems = vi.fn().mockImplementation(async (syncItem?: (item: CartItem) => Promise<unknown> | unknown) => {
        if (syncItem) {
          await syncItem(guestItem);
        }
      });
      const guestItem = {
        ...mockCartItem,
        quantity: 1,
        product: {
          ...mockCartItem.product,
          id: 'product-2',
          title: 'Guest Product',
        },
      } as CartItem;

      vi.mocked(useCartStore).mockReturnValue({
        guestItems: [guestItem],
        addGuestItem: vi.fn(),
        updateGuestItem: vi.fn(),
        removeGuestItem: vi.fn(),
        mergeGuestItems,
        lastAdded: null,
        isDrawerOpen: false,
        openDrawer: vi.fn(),
        closeDrawer: vi.fn(),
      } as any);

      vi.mocked(cartApi.addItem).mockResolvedValue({ data: mockUserCart } as any);

      renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(cartApi.addItem).toHaveBeenCalledWith({
          productId: guestItem.product.id,
          unitPrice: guestItem.unitPrice,
          quantity: guestItem.quantity,
        });
      });

      expect(mergeGuestItems).toHaveBeenCalled();
    });

    it('should add item via API when authenticated', async () => {
      setupAuthenticatedUser();
      setupCartStore();

      vi.mocked(cartApi.addItem).mockResolvedValue({ data: mockUserCart } as any);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.cart).toBeDefined();
      });

      const onSuccess = vi.fn();
      act(() => {
        result.current.addItem(mockCartItem, onSuccess);
      });

      await waitFor(() => {
        expect(cartApi.addItem).toHaveBeenCalledWith({
          productId: mockCartItem.product.id,
          unitPrice: mockCartItem.unitPrice,
          quantity: mockCartItem.quantity,
        });
      });
    });

    it('should call onSuccess callback after adding item', async () => {
      setupAuthenticatedUser();
      setupCartStore();

      vi.mocked(cartApi.addItem).mockResolvedValue({ data: mockUserCart } as any);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.cart).toBeDefined();
      });

      const onSuccess = vi.fn();
      act(() => {
        result.current.addItem(mockCartItem, onSuccess);
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should update item via API when authenticated', async () => {
      setupAuthenticatedUser();
      setupCartStore();

      vi.mocked(cartApi.updateItem).mockResolvedValue({ data: mockUserCart } as any);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.cart).toBeDefined();
      });

      act(() => {
        result.current.updateItem(mockCartItem);
      });

      await waitFor(() => {
        expect(cartApi.updateItem).toHaveBeenCalledWith(mockCartItem);
      });
    });

    it('should remove item via API when authenticated', async () => {
      setupAuthenticatedUser();
      setupCartStore();

      vi.mocked(cartApi.removeItem).mockResolvedValue({ data: {} } as any);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      await waitFor(() => {
        expect(result.current.cart).toBeDefined();
      });

      act(() => {
        result.current.removeItem(mockCartItem);
      });

      await waitFor(() => {
        expect(cartApi.removeItem).toHaveBeenCalledWith(mockCartItem.id);
      });
    });
  });

  describe('Guest User', () => {
    it('should use guest items when not authenticated', async () => {
      setupGuestUser();
      setupCartStore([mockCartItem]);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      expect(result.current.cart?.items).toEqual([mockCartItem]);
      expect(cartApi.getCart).not.toHaveBeenCalled();
    });

    it('should return empty cart for guest user with no items', async () => {
      setupGuestUser();
      setupCartStore([]);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      expect(result.current.cart?.items).toEqual([]);
    });

    it('should add item to guest cart when not authenticated', () => {
      setupGuestUser();
      const addGuestItem = vi.fn();
      vi.mocked(useCartStore).mockReturnValue({
        guestItems: [],
        addGuestItem,
        updateGuestItem: vi.fn(),
        removeGuestItem: vi.fn(),
        mergeGuestItems: vi.fn().mockResolvedValue(undefined),
        lastAdded: null,
        isDrawerOpen: false,
        openDrawer: vi.fn(),
        closeDrawer: vi.fn(),
      } as any);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      const onSuccess = vi.fn();
      act(() => {
        result.current.addItem(mockCartItem, onSuccess);
      });

      expect(addGuestItem).toHaveBeenCalledWith(mockCartItem);
      expect(onSuccess).toHaveBeenCalled();
      expect(cartApi.addItem).not.toHaveBeenCalled();
    });

    it('should update item in guest cart when not authenticated', () => {
      setupGuestUser();
      const updateGuestItem = vi.fn();
      vi.mocked(useCartStore).mockReturnValue({
        guestItems: [mockCartItem],
        addGuestItem: vi.fn(),
        updateGuestItem,
        removeGuestItem: vi.fn(),
        mergeGuestItems: vi.fn().mockResolvedValue(undefined),
        lastAdded: null,
        isDrawerOpen: false,
        openDrawer: vi.fn(),
        closeDrawer: vi.fn(),
      } as any);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.updateItem(mockCartItem);
      });

      expect(updateGuestItem).toHaveBeenCalledWith(mockCartItem.product.id, mockCartItem.quantity);
      expect(cartApi.updateItem).not.toHaveBeenCalled();
    });

    it('should remove item from guest cart when not authenticated', () => {
      setupGuestUser();
      const removeGuestItem = vi.fn();
      vi.mocked(useCartStore).mockReturnValue({
        guestItems: [mockCartItem],
        addGuestItem: vi.fn(),
        updateGuestItem: vi.fn(),
        removeGuestItem,
        mergeGuestItems: vi.fn().mockResolvedValue(undefined),
        lastAdded: null,
        isDrawerOpen: false,
        openDrawer: vi.fn(),
        closeDrawer: vi.fn(),
      } as any);

      const { result } = renderHook(() => useCart(), {
        wrapper: createQueryClientWrapper(),
      });

      act(() => {
        result.current.removeItem(mockCartItem);
      });

      expect(removeGuestItem).toHaveBeenCalledWith(mockCartItem.product.id);
      expect(cartApi.removeItem).not.toHaveBeenCalled();
    });
  });

  describe('Query Cache Invalidation', () => {
    it('should invalidate cart query after adding item', async () => {
      setupAuthenticatedUser();
      setupCartStore();

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      vi.mocked(cartApi.addItem).mockResolvedValue({ data: mockUserCart } as any);

      const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.cart).toBeDefined();
      });

      act(() => {
        result.current.addItem(mockCartItem);
      });

      await waitFor(() => {
        expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['cart'] });
      });
    });
  });
});
