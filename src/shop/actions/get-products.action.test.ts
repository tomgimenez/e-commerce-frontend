import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProductsAction } from './get-products.action';
import { backendApi } from '@/api/backendApi';

vi.mock('@/api/backendApi', () => ({
  backendApi: {
    get: vi.fn(),
  },
}));

const mockProductsResponse = {
  products: [
    { id: '1', title: 'Product A', price: 100 },
    { id: '2', title: 'Product B', price: 200 },
  ],
  total: 2,
  limit: 10,
  offset: 0,
};

describe('getProductsAction', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(backendApi.get).mockResolvedValue({ data: mockProductsResponse });
  });

  it('should call the correct endpoint', async () => {
    await getProductsAction({});

    expect(backendApi.get).toHaveBeenCalledWith('/products', expect.any(Object));
  });

  it('should return the data from the response', async () => {
    const result = await getProductsAction({});

    expect(result).toEqual(mockProductsResponse);
  });

  it('should forward all provided params', async () => {
    await getProductsAction({ limit: 10, offset: 20, minPrice: 50, maxPrice: 200, q: 'shirt' });

    expect(backendApi.get).toHaveBeenCalledWith('/products', {
      params: { limit: 10, offset: 20, minPrice: 50, maxPrice: 200, q: 'shirt' },
    });
  });

  it('should send undefined for params not provided', async () => {
    await getProductsAction({ limit: 5 });

    expect(backendApi.get).toHaveBeenCalledWith('/products', {
      params: { limit: 5, offset: undefined, minPrice: undefined, maxPrice: undefined, q: undefined },
    });
  });

  it('should propagate errors from the API', async () => {
    vi.mocked(backendApi.get).mockRejectedValue(new Error('Network error'));

    await expect(getProductsAction({})).rejects.toThrow('Network error');
  });
});