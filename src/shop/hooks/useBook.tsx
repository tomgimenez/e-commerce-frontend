import { isBook } from "@/interfaces/product.guards";
import { useProduct } from "./useProduct"

export const useBook = () => {
  const { data, ...rest } = useProduct();

  return {
      ...rest,
      data: data && isBook(data) ? data : undefined
    };
}
