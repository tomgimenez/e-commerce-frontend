import type { ReactNode } from 'react';
import { describe, expect, vi, beforeEach, test } from 'vitest';
import { useSearchParams } from 'react-router';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAdminProducts } from './useAdminProducts';
import { getProductsAction } from '@/shop/actions/get-products.action';
import type { Product } from '@/interfaces/product.interface';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/shop/actions/get-products.action', () => ({
  getProductsAction: vi.fn(),
}));

vi.mock('react-router', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('@/adapters/product.adapter', () => ({
  adaptProduct: vi.fn((product) => product)
}));

// ── Setup ──────────────────────────────────────────────────────────────────

  const mockProducts = [
    { id: '1', name: 'Product 1', price: 100 } as unknown as Product,
    { id: '2', name: 'Product 2', price: 200 } as unknown as Product,
  ];

const createQueryWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('useAdminProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should get products with default parameters', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    vi.mocked(getProductsAction).mockResolvedValue({
      products: mockProducts,
      count: 2,
      pages: 1
    });

    const { result } = renderHook(() => useAdminProducts(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getProductsAction).toHaveBeenCalledWith({
      limit: 9,
      offset: 0,
      q: '',
    });

    expect(result.current.data).toEqual({
      products: mockProducts,
      count: 2,
      pages: 1
    });
  });

  test('should calculate offset correctly', async () => {
    const params = new URLSearchParams('page=2&limit=10');
    vi.mocked(useSearchParams).mockReturnValue([params, vi.fn()]);

    vi.mocked(getProductsAction).mockResolvedValue({
      products: mockProducts,
      count: 2,
      pages: 1
    });

    const { result } = renderHook(() => useAdminProducts(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getProductsAction).toHaveBeenCalledWith({
      limit: '10',
      offset: 10,
      q: '',
    });
  });

  test('should use search query when present', async () => {
    const params = new URLSearchParams('query=fantasy');
    vi.mocked(useSearchParams).mockReturnValue([params, vi.fn()]);

    vi.mocked(getProductsAction).mockResolvedValue({
      products: mockProducts,
      count: 2,
      pages: 1
    });

    const { result } = renderHook(() => useAdminProducts(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getProductsAction).toHaveBeenCalledWith({
      limit: 9,
      offset: 0,
      q: 'fantasy',
    });
  });

  test('should handle invalid values in limit', async () => {
    const params = new URLSearchParams('limit=invalid&page=invalid');
    vi.mocked(useSearchParams).mockReturnValue([params, vi.fn()]);

    vi.mocked(getProductsAction).mockResolvedValue({
      products: mockProducts,
      count: 2,
      pages: 1
    });

    const { result } = renderHook(() => useAdminProducts(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getProductsAction).toHaveBeenCalledWith({
      limit: 9,
      offset: 0,
      q: '',
    });
  });

  test('should handle errors in action', async () => {
    const error = new Error('Network error');
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      vi.fn(),
    ]);

    vi.mocked(getProductsAction).mockRejectedValue(error);

    const { result } = renderHook(() => useAdminProducts(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});
