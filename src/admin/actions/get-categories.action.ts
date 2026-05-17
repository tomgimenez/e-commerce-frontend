import { backendApi } from "@/api/backendApi";
import type { Category } from "@/interfaces/category.interface";

export const getCategoriesAction = async (): Promise<Category[]> => {
  const { data } = await backendApi.get('/category');

  return data;
}