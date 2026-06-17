import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartStore } from './cart.store';
import type { CartItem } from '@/interfaces/cart.interface';
import type { Product } from '@/interfaces/product.interface';

// ── Setup ──────────────────────────────────────────────────────────────────

const mockProduct = {
  id: 'product-1',
  title: 'Test Product',
  price: 100,
} as any as Product;

const mockProduct2 = {
  id: 'product-2',
  title: 'Another Product',
  price: 50,
} as any as Product;

const mockCartItem: CartItem = {
  id: 'item-1',
  quantity: 2,
  unitPrice: 100,
  product: mockProduct,
};

const mockCartItem2: CartItem = {
  id: 'item-2',
  quantity: 1,
  unitPrice: 50,
  product: mockProduct2,
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('useCartStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset all stores
    vi.clearAllMocks();

    act(() => {
      useCartStore.setState({ guestItems: [] })
    })
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Drawer Management', () => {
    it('should initialize with drawer closed and no lastAdded item', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.isDrawerOpen).toBe(false);
      expect(result.current.lastAdded).toBeNull();
    });

    it('should open drawer and set lastAdded item', () => {
      const { result } = renderHook(() => useCartStore());
      const item = { title: 'Test Product' };

      act(() => {
        result.current.openDrawer(item);
      });

      expect(result.current.isDrawerOpen).toBe(true);
      expect(result.current.lastAdded).toEqual(item);
    });

    it('should update lastAdded when opening drawer again', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openDrawer({ title: 'First Item' });
      });

      expect(result.current.lastAdded).toEqual({ title: 'First Item' });

      act(() => {
        result.current.openDrawer({ title: 'Second Item' });
      });

      expect(result.current.lastAdded).toEqual({ title: 'Second Item' });
    });

    it('should close drawer', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openDrawer({ title: 'Test' });
      });

      expect(result.current.isDrawerOpen).toBe(true);

      act(() => {
        result.current.closeDrawer();
      });

      expect(result.current.isDrawerOpen).toBe(false);
    });

    it('should keep lastAdded when closing drawer', () => {
      const { result } = renderHook(() => useCartStore());
      const item = { title: 'Test Product' };

      act(() => {
        result.current.openDrawer(item);
      });

      act(() => {
        result.current.closeDrawer();
      });

      expect(result.current.lastAdded).toEqual(item);
      expect(result.current.isDrawerOpen).toBe(false);
    });

    it('should handle multiple open/close cycles', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openDrawer({ title: 'Item 1' });
        result.current.closeDrawer();
        result.current.openDrawer({ title: 'Item 2' });
        result.current.closeDrawer();
      });

      expect(result.current.lastAdded).toEqual({ title: 'Item 2' });
      expect(result.current.isDrawerOpen).toBe(false);
    });
  });

  describe('Guest Cart - Add Item', () => {
    it('should initialize with empty guestItems', () => {
      const { result } = renderHook(() => useCartStore());

      expect(result.current.guestItems).toEqual([]);
    });

    it('should add a new item to guest cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      expect(result.current.guestItems).toHaveLength(1);
      expect(result.current.guestItems[0].product.id).toBe('product-1');
      expect(result.current.guestItems[0].quantity).toBe(2);
    });

    it('should generate UUID for new item if not provided', () => {
      const { result } = renderHook(() => useCartStore());
      const itemWithoutId = { ...mockCartItem, id: undefined };

      act(() => {
        result.current.addGuestItem(itemWithoutId);
      });

      expect(result.current.guestItems[0].id).toBeDefined();
      expect(typeof result.current.guestItems[0].id).toBe('string');
      expect(result.current.guestItems[0].id).toMatch(/^[\da-f-]{36}$/i);
    });

    it('should increment quantity if product already exists', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      expect(result.current.guestItems[0].quantity).toBe(2);

      const itemToAdd = {
        ...mockCartItem,
        quantity: 1,
      };

      act(() => {
        result.current.addGuestItem(itemToAdd);
      });

      expect(result.current.guestItems).toHaveLength(1);
      expect(result.current.guestItems[0].quantity).toBe(3); // 2 + 1
    });

    it('should add multiple different products to cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
        result.current.addGuestItem(mockCartItem2);
      });

      expect(result.current.guestItems).toHaveLength(2);
      expect(result.current.guestItems[0].product.id).toBe('product-1');
      expect(result.current.guestItems[1].product.id).toBe('product-2');
    });

    it('should not modify original item when adding', () => {
      const { result } = renderHook(() => useCartStore());
      const originalItem = JSON.parse(JSON.stringify(mockCartItem));

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      expect(mockCartItem).toEqual(originalItem);
    });

    it('should handle adding item with quantity 0', () => {
      const { result } = renderHook(() => useCartStore());
      const itemWithZeroQty = { ...mockCartItem, quantity: 0 };

      act(() => {
        result.current.addGuestItem(itemWithZeroQty);
      });

      expect(result.current.guestItems).toHaveLength(1);
      expect(result.current.guestItems[0].quantity).toBe(0);
    });
  });

  describe('Guest Cart - Update Item', () => {
    it('should update quantity for existing product', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      act(() => {
        result.current.updateGuestItem('product-1', 5);
      });

      expect(result.current.guestItems[0].quantity).toBe(5);
    });

    it('should not update other items when updating one', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
        result.current.addGuestItem(mockCartItem2);
      });

      act(() => {
        result.current.updateGuestItem('product-1', 10);
      });

      expect(result.current.guestItems[0].quantity).toBe(10);
      expect(result.current.guestItems[1].quantity).toBe(1);
    });

    it('should handle update when product does not exist', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      act(() => {
        result.current.updateGuestItem('non-existent-product', 5);
      });

      expect(result.current.guestItems).toHaveLength(1);
      expect(result.current.guestItems[0].quantity).toBe(2); // unchanged
    });

    it('should update to zero quantity', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      act(() => {
        result.current.updateGuestItem('product-1', 0);
      });

      expect(result.current.guestItems[0].quantity).toBe(0);
    });

    it('should update to negative quantity', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      act(() => {
        result.current.updateGuestItem('product-1', -5);
      });

      expect(result.current.guestItems[0].quantity).toBe(-5);
    });

    it('should maintain item properties when updating', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      const itemId = result.current.guestItems[0].id;

      act(() => {
        result.current.updateGuestItem('product-1', 10);
      });

      expect(result.current.guestItems[0].id).toBe(itemId);
      expect(result.current.guestItems[0].unitPrice).toBe(100);
      expect(result.current.guestItems[0].product).toEqual(mockProduct);
    });
  });

  describe('Guest Cart - Remove Item', () => {
    it('should remove item from guest cart', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      expect(result.current.guestItems).toHaveLength(1);

      act(() => {
        result.current.removeGuestItem('product-1');
      });

      expect(result.current.guestItems).toHaveLength(0);
    });

    it('should only remove item with matching productId', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
        result.current.addGuestItem(mockCartItem2);
      });

      act(() => {
        result.current.removeGuestItem('product-1');
      });

      expect(result.current.guestItems).toHaveLength(1);
      expect(result.current.guestItems[0].product.id).toBe('product-2');
    });

    it('should handle removing non-existent item', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      act(() => {
        result.current.removeGuestItem('non-existent-product');
      });

      expect(result.current.guestItems).toHaveLength(1);
    });

    it('should handle removing from empty cart', () => {
      const { result } = renderHook(() => useCartStore());

      expect(() => {
        act(() => {
          result.current.removeGuestItem('product-1');
        });
      }).not.toThrow();

      expect(result.current.guestItems).toHaveLength(0);
    });

    it('should remove all items when called multiple times', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
        result.current.addGuestItem(mockCartItem2);
      });

      act(() => {
        result.current.removeGuestItem('product-1');
        result.current.removeGuestItem('product-2');
      });

      expect(result.current.guestItems).toHaveLength(0);
    });
  });

  describe('Persistence', () => {
    it('should persist guest items to localStorage', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
      });

      const stored = localStorage.getItem('guest-cart');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.guestItems).toHaveLength(1);
      expect(parsed.state.guestItems[0].product.id).toBe('product-1');
    });

    it('should not persist drawer state to localStorage', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openDrawer({ title: 'Test' });
      });

      const stored = localStorage.getItem('guest-cart');
      const parsed = JSON.parse(stored!);

      expect(parsed.state.isDrawerOpen).toBeUndefined();
      expect(parsed.state.lastAdded).toBeUndefined();
    });

    it('should restore persisted items on new hook instance', () => {
      const { result: result1 } = renderHook(() => useCartStore());

      act(() => {
        result1.current.addGuestItem(mockCartItem);
      });

      // Create a new hook instance
      const { result: result2 } = renderHook(() => useCartStore());

      expect(result2.current.guestItems).toHaveLength(1);
      expect(result2.current.guestItems[0].product.id).toBe('product-1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid consecutive additions', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addGuestItem(mockCartItem);
        }
      });

      expect(result.current.guestItems).toHaveLength(1);
      expect(result.current.guestItems[0].quantity).toBe(20); // 2 * 10
    });

    it('should handle adding items with same productId but different unitPrice', () => {
      const { result } = renderHook(() => useCartStore());
      const item1 = { ...mockCartItem, unitPrice: 100 };
      const item2 = { ...mockCartItem, unitPrice: 80 }; // Same product, different price

      act(() => {
        result.current.addGuestItem(item1);
      });

      expect(result.current.guestItems[0].unitPrice).toBe(100);

      act(() => {
        result.current.addGuestItem(item2);
      });

      // Should increment quantity but keep original unitPrice
      expect(result.current.guestItems).toHaveLength(1);
      expect(result.current.guestItems[0].unitPrice).toBe(100);
    });

    it('should maintain cart state through multiple operations', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.addGuestItem(mockCartItem);
        result.current.addGuestItem(mockCartItem2);
        result.current.updateGuestItem('product-1', 5);
      });

      expect(result.current.guestItems).toHaveLength(2);
      expect(result.current.guestItems[0].quantity).toBe(5);
      expect(result.current.guestItems[1].quantity).toBe(1);

      act(() => {
        result.current.removeGuestItem('product-1');
      });

      expect(result.current.guestItems).toHaveLength(1);
      expect(result.current.guestItems[0].product.id).toBe('product-2');
    });

    it('should handle drawer and cart operations simultaneously', () => {
      const { result } = renderHook(() => useCartStore());

      act(() => {
        result.current.openDrawer({ title: 'Test Item' });
        result.current.addGuestItem(mockCartItem);
      });

      expect(result.current.isDrawerOpen).toBe(true);
      expect(result.current.lastAdded).toEqual({ title: 'Test Item' });
      expect(result.current.guestItems).toHaveLength(1);

      act(() => {
        result.current.closeDrawer();
        result.current.addGuestItem(mockCartItem2);
      });

      expect(result.current.isDrawerOpen).toBe(false);
      expect(result.current.guestItems).toHaveLength(2);
    });
  });
});
