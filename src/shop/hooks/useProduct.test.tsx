import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useParams } from 'react-router';
import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';

import { useProduct } from './useProduct';
import { getProductByIdAction } from '@/actions/products/get-product-by-id.action';

vi.mock('react-router', () => ({
  useParams: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
}));

vi.mock('@/actions/products/get-product-by-id.action', () => ({
  getProductByIdAction: vi.fn(),
}));


describe('useProduct', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call useQuery with the correct queryKey when id is present', () => {
    vi.mocked(useParams).mockReturnValue({ id: 'abc-123' });

    renderHook(() => useProduct());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['product', { id: 'abc-123' }],
      }),
    );
  });

  it('should enable the query when id is present', () => {
    vi.mocked(useParams).mockReturnValue({ id: 'abc-123' });

    renderHook(() => useProduct());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: true }),
    );
  });

  it('should disable the query when id is absent', () => {
    vi.mocked(useParams).mockReturnValue({});

    renderHook(() => useProduct());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it('should set retry to false', () => {
    vi.mocked(useParams).mockReturnValue({ id: 'abc-123' });

    renderHook(() => useProduct());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ retry: false }),
    );
  });

  it('should set staleTime to 5 minutes', () => {
    vi.mocked(useParams).mockReturnValue({ id: 'abc-123' });

    renderHook(() => useProduct());

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ staleTime: 1000 * 60 * 5 }),
    );
  });

  it('should call getProductByIdAction with the id when queryFn is invoked', () => {
    vi.mocked(useParams).mockReturnValue({ id: 'abc-123' });

    renderHook(() => useProduct());

    const { queryFn } = vi.mocked(useQuery).mock.calls[0][0] as any;
    queryFn();

    expect(getProductByIdAction).toHaveBeenCalledWith('abc-123');
  });

  it('should call getProductByIdAction with empty string when id is absent', () => {
    vi.mocked(useParams).mockReturnValue({});

    renderHook(() => useProduct());

    const { queryFn } = vi.mocked(useQuery).mock.calls[0][0] as any;
    queryFn();

    expect(getProductByIdAction).toHaveBeenCalledWith('');
  });
});