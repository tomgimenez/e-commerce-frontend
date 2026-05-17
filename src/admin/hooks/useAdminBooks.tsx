import { isBook } from "@/interfaces/product.guards";
import { useAdminProducts } from "./useAdminProducts";
import type { Book } from "@/interfaces/book.interface";

export const useAdminBooks = () => {
  const { data, ...rest } = useAdminProducts();

  return {
    ...rest,
    data: data
      ? { ...data, products: data.products.filter(isBook) satisfies Book[] }
      : undefined
  };
};