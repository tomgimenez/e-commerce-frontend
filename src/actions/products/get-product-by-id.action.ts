import { adaptProduct } from "@/adapters/product.adapter";
import { backendApi } from "@/api/backendApi";
import type { Product, ProductUI } from "@/interfaces/product.interface";

export const getProductByIdAction = async (id: string): Promise<ProductUI> => {

  if (!id) throw new Error('id is required');

  const { data } = await backendApi.get<Product>(`/products/${id}`);
  
  return adaptProduct(data);
}