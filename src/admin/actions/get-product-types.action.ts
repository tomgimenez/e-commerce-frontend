import { backendApi } from "@/api/backendApi";
import type { ProductTypesResponse } from "@/interfaces/product.interface";

export const getProductTypesAction = async (): Promise<ProductTypesResponse> => {
  const { data } = await backendApi.get('/product-types');

  return data;
}