import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProducts } from './useProducts';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

vi.mock('react-router', () => ({
  useSearchParams: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: undefined, isLoading: false }),
}));

vi.mock('../actions/get-products.action', () => ({
  getProductsAction: vi.fn(),
}));

import { getProductsAction } from '../actions/get-products.action';

function setParams(params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams(params);
  vi.mocked(useSearchParams).mockReturnValue([searchParams, vi.fn()]);
}

function getLastQueryCall() {
  return vi.mocked(useQuery).mock.calls.at(-1)![0] as any;
}

describe('useProducts', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    setParams(); // no params by default
  });

  describe('when no search params are present', () => {
    it('should call useQuery with default queryKey values', () => {
      renderHook(() => useProducts());

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ['products', { offset: 0, limit: 8, minPrice: undefined, maxPrice: undefined, q: '' }],
        }),
      );
    });

    it('should call getProductsAction with default values when queryFn is invoked', () => {
      renderHook(() => useProducts());

      getLastQueryCall().queryFn();

      expect(getProductsAction).toHaveBeenCalledWith({
        limit: 8,
        offset: 0,
        minPrice: undefined,
        maxPrice: undefined,
        q: '',
      });
    });
  });

  describe('pagination', () => {
    it('should calculate offset correctly for page 2 with default limit', () => {
      setParams({ page: '2' });
      renderHook(() => useProducts());

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining([
            expect.objectContaining({ offset: 8 }),
          ]),
        }),
      );
    });

    it('should calculate offset correctly for page 3 with custom limit', () => {
      setParams({ page: '3', limit: '10' });
      renderHook(() => useProducts());

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining([
            expect.objectContaining({ offset: 20, limit: '10' }),
          ]),
        }),
      );
    });
  });

  describe('search query', () => {
    it('should pass the q param to the queryKey and queryFn', () => {
      setParams({ query: 'magic sword' });
      renderHook(() => useProducts());

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: expect.arrayContaining([
            expect.objectContaining({ q: 'magic sword' }),
          ]),
        }),
      );

      getLastQueryCall().queryFn();
      expect(getProductsAction).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'magic sword' }),
      );
    });
  });

  describe('price filter', () => {
    it.each([
      { price: '0-10',  minPrice: 0,         maxPrice: 10        },
      { price: '10-15', minPrice: 10,        maxPrice: 15        },
      { price: '15-20', minPrice: 15,        maxPrice: 20        },
      { price: '20+',   minPrice: 20,        maxPrice: undefined },
      { price: 'any',   minPrice: undefined, maxPrice: undefined },
    ])('should set minPrice=$minPrice and maxPrice=$maxPrice for price="$price"', ({ price, minPrice, maxPrice }) => {
      setParams({ price });
      renderHook(() => useProducts());

      getLastQueryCall().queryFn();

      expect(getProductsAction).toHaveBeenCalledWith(
        expect.objectContaining({ minPrice, maxPrice }),
      );
    });

    it('should set minPrice and maxPrice to undefined for an unknown price filter', () => {
      setParams({ price: 'unknown' });
      renderHook(() => useProducts());

      getLastQueryCall().queryFn();

      expect(getProductsAction).toHaveBeenCalledWith(
        expect.objectContaining({ minPrice: undefined, maxPrice: undefined }),
      );
    });
  });

  describe('invalid params', () => {
    it('should fall back to limit=8 when limit param is not a number', () => {
      setParams({ limit: 'abc' });
      renderHook(() => useProducts());

      getLastQueryCall().queryFn();

      expect(getProductsAction).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 8 }),
      );
    });

    it('should fall back to offset=0 when page param produces a NaN offset', () => {
      setParams({ page: 'abc' });
      renderHook(() => useProducts());

      getLastQueryCall().queryFn();

      expect(getProductsAction).toHaveBeenCalledWith(
        expect.objectContaining({ offset: 0 }),
      );
    });
  });
});