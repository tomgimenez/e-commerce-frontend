import { backendApi } from "@/api/backendApi";
import type { Product } from "@/interfaces/product.interface";

export const getProductByIdAction = async (id: string): Promise<Product> => {

  if (!id) throw new Error('id is required');

  const { data } = await backendApi.get<Product>(`/products/${id}`);

  return data; 
}