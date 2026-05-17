import { isBook } from "@/interfaces/product.guards";
import { useProducts } from "./useProducts";
import type { Book } from "@/interfaces/book.interface";

export const useBooks = () => {
  const { data, ...rest } = useProducts();

  return {
    ...rest,
    data: data
      ? { ...data, products: data.products.filter(isBook) satisfies Book[] }
      : undefined
  };
};