import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProduct } from './useProduct';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/actions/products/get-product-by-id.action', () => ({
  getProductByIdAction: vi.fn(),
}));

vi.mock('@/admin/actions/create-update-product.action', () => ({
  createUpdateProductAction: vi.fn(),
}));

vi.mock('@/adapters/product.adapter', () => ({
  adaptProduct: vi.fn((product) => product) // simplemente devuelve el producto tal cual
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
}));

// ── Setup ──────────────────────────────────────────────────────────────────

import { getProductByIdAction } from '@/actions/products/get-product-by-id.action';
import { createUpdateProductAction } from '@/admin/actions/create-update-product.action';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import type { Product } from '@/interfaces/product.interface';

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  stock: 10,
  description: 'Test Description'
} as unknown as Product;

const createQueryWrapper = () => {
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

// ── Tests ──────────────────────────────────────────────────────────────────

describe('useProduct', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  describe('Get product', () => {
    it('get a product when id is not "new"', async () => {
      vi.mocked(getProductByIdAction).mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProduct('1'), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(getProductByIdAction).toHaveBeenCalledWith('1');
      expect(result.current.data).toEqual(mockProduct);
    });

    it('does not query when id is "new"', async () => {
      const { result } = renderHook(() => useProduct('new'), {
        wrapper: createQueryWrapper(),
      });

      expect(getProductByIdAction).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    it('does not query when id is empty', async () => {
      const { result } = renderHook(() => useProduct(''), {
        wrapper: createQueryWrapper(),
      });

      expect(getProductByIdAction).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });

    it('handles errors when fetching a product', async () => {
      const error = new Error('Product not found');
      vi.mocked(getProductByIdAction).mockRejectedValue(error);

      const { result } = renderHook(() => useProduct('invalid'), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBe(error);
    });
  });

  describe('Save product', () => {
    it('saves a product successfully', async () => {
      vi.mocked(createUpdateProductAction).mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProduct('new'), {
        wrapper: createQueryWrapper(),
      });

      await result.current.handleSubmit({
        title: 'New Product',
        price: 50
      });
      
      await waitFor(() => expect(result.current.isPending).toBe(false));
      
      expect(createUpdateProductAction).toHaveBeenCalledWith({
        title: 'New Product',
        price: 50,
        images: []
      }, {
        client: {},
        meta: undefined,
        mutationKey: undefined,
      });

      expect(vi.mocked(toast.success)).toHaveBeenCalledWith(
        'Product saved correctly'
      );

      expect(mockNavigate).toHaveBeenCalledWith('/admin/products');
    });

    it('handles errors when saving a product', async () => {
      const error = new Error('Save failed');
      vi.mocked(createUpdateProductAction).mockRejectedValue(error);

      const { result } = renderHook(() => useProduct('new'), {
        wrapper: createQueryWrapper(),
      });

      await expect(
        result.current.handleSubmit({
          title: 'New Product',
          price: 50,
        })
      ).rejects.toThrow(error);

      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        'Error saving product. Please try again.'
      );

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('includes files in the request', async () => {
      const mockFile = new File(['content'], 'test.jpg', {
        type: 'image/jpeg',
      });

      vi.mocked(createUpdateProductAction).mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProduct('new'), {
        wrapper: createQueryWrapper(),
      });

      await result.current.handleSubmit({
        title: 'Product with Image',
        price: 75,
        files: [mockFile],
      });

      await waitFor(() => expect(result.current.isPending).toBe(false));

      expect(createUpdateProductAction).toHaveBeenCalledWith({
        title: 'Product with Image',
        price: 75,
        files: [mockFile],
        images: []
      }, {
        client: {},
        meta: undefined,
        mutationKey: undefined,
      });
    });
  });

  describe('hook state', () => {
    it('returns isPending correctly', async () => {
      vi.mocked(createUpdateProductAction).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockProduct), 100)
          )
      );

      const { result } = renderHook(() => useProduct('new'), {
        wrapper: createQueryWrapper(),
      });

      expect(result.current.isPending).toBe(false);

      const submitPromise = result.current.handleSubmit({
        title: 'Test',
        price: 100,
      });

      await waitFor(() => expect(result.current.isPending).toBe(true));

      await submitPromise;

      await waitFor(() => expect(result.current.isPending).toBe(false));
    });

    it('returns query properties from the hook', async () => {
      vi.mocked(getProductByIdAction).mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProduct('1'), {
        wrapper: createQueryWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isPending');
      expect(result.current).toHaveProperty('handleSubmit');
    });
  });
});
