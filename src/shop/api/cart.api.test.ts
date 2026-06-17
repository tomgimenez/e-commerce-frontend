import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCart, addItem, updateItem, removeItem } from './cart.api';
import { backendApi } from '@/api/backendApi';

vi.mock('@/api/backendApi', () => ({
  backendApi: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockCartResponse = {
  id: 'cart-1',
  updatedAt: new Date(),
  items: [
    {
      id: 'item-1',
      quantity: 2,
      unitPrice: 100,
      product: {
        id: 'product-1',
        title: 'Test Product',
        price: 100,
      },
    },
  ],
};

const mockCartItem = {
  id: 'item-1',
  quantity: 3,
  unitPrice: 100,
  product: {
    id: 'product-1',
    title: 'Test Product',
    price: 100,
  },
} as any;

const mockCartItemDto = {
  productId: 'product-1',
  unitPrice: 100,
  quantity: 2,
};

describe('Cart API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCart', () => {
    it('should call the correct endpoint', async () => {
      vi.mocked(backendApi.get).mockResolvedValue({ data: mockCartResponse });

      await getCart();

      expect(backendApi.get).toHaveBeenCalledWith('/cart');
    });

    it('should return the cart data', async () => {
      vi.mocked(backendApi.get).mockResolvedValue({ data: mockCartResponse });

      const result = await getCart();

      expect(result).toEqual(mockCartResponse);
    });

    it('should handle empty cart', async () => {
      const emptyCart = { id: 'cart-1', updatedAt: new Date(), items: [] };
      vi.mocked(backendApi.get).mockResolvedValue({ data: emptyCart });

      const result = await getCart();

      expect(result.items).toHaveLength(0);
    });
  });

  describe('addItem', () => {
    it('should call the correct endpoint with item data', async () => {
      vi.mocked(backendApi.post).mockResolvedValue({ data: mockCartResponse });

      await addItem(mockCartItemDto);

      expect(backendApi.post).toHaveBeenCalledWith('/cart/add-item', mockCartItemDto);
    });

    it('should return the response from the API', async () => {
      const response = { data: mockCartResponse };
      vi.mocked(backendApi.post).mockResolvedValue(response);

      const result = await addItem(mockCartItemDto);

      expect(result).toEqual(response);
    });

    it('should send product ID, unit price, and quantity', async () => {
      vi.mocked(backendApi.post).mockResolvedValue({ data: mockCartResponse });

      const itemData = {
        productId: 'product-2',
        unitPrice: 150,
        quantity: 1,
      };

      await addItem(itemData);

      expect(backendApi.post).toHaveBeenCalledWith('/cart/add-item', itemData);
    });
  });

  describe('updateItem', () => {
    it('should call the correct endpoint with item ID', async () => {
      vi.mocked(backendApi.patch).mockResolvedValue({ data: mockCartResponse });

      await updateItem(mockCartItem);

      expect(backendApi.patch).toHaveBeenCalledWith(
        `/cart/update-item/${mockCartItem.id}`,
        expect.any(Object)
      );
    });

    it('should send quantity, product ID, and unit price', async () => {
      vi.mocked(backendApi.patch).mockResolvedValue({ data: mockCartResponse });

      await updateItem(mockCartItem);

      expect(backendApi.patch).toHaveBeenCalledWith(
        `/cart/update-item/${mockCartItem.id}`,
        {
          quantity: mockCartItem.quantity,
          productId: mockCartItem.product.id,
          unitPrice: Number(mockCartItem.unitPrice),
        }
      );
    });

    it('should convert unitPrice to number', async () => {
      vi.mocked(backendApi.patch).mockResolvedValue({ data: mockCartResponse });

      const itemWithStringPrice = {
        ...mockCartItem,
        unitPrice: '100' as any,
      };

      await updateItem(itemWithStringPrice);

      expect(backendApi.patch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          unitPrice: 100,
        })
      );
    });
  });

  describe('removeItem', () => {
    it('should call the correct endpoint with item ID', async () => {
      vi.mocked(backendApi.delete).mockResolvedValue({ data: {} });

      await removeItem('item-1');

      expect(backendApi.delete).toHaveBeenCalledWith('/cart/delete-item/item-1');
    });

    it('should handle different item IDs', async () => {
      vi.mocked(backendApi.delete).mockResolvedValue({ data: {} });

      const itemId = 'item-12345';
      await removeItem(itemId);

      expect(backendApi.delete).toHaveBeenCalledWith(`/cart/delete-item/${itemId}`);
    });
  });
});
