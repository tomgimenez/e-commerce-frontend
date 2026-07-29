import { backendApi } from "@/api/backendApi";
import type { Product } from "@/interfaces/product.interface";

export const getBestsellers = async (): Promise<Product[]> => {

  const { data } = await backendApi.get<Product[]>('/products/attribute/isBestseller', {
    params: {
      value: true
    }
  });

  return data;
}