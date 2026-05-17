import { backendApi } from "@/api/backendApi"
import type { ProductsResponse } from "@/interfaces/products.response";

interface Options {
  limit?: number | string;
  offset?: number | string;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  q?: string | undefined;
}

export const getProductsAction = async (options: Options): Promise<ProductsResponse> => {

  const { limit, offset, minPrice, maxPrice, q } = options;

  const { data } = await backendApi.get<ProductsResponse>('/products', {
    params: {
      limit, offset, minPrice, maxPrice, q
    }
  });

  return data;
}