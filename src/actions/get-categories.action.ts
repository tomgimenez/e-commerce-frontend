import { backendApi } from "@/api/backendApi";
import type { Category } from "@/interfaces/product.interface";

export const getCategoriesAction = async (): Promise<Category[]> => {
  const { data } = await backendApi.get('/category');

  return data;
}