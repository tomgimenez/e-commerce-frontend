import { useQuery } from "@tanstack/react-query";
import { getProductTypesAction } from "../actions/get-product-types.action";

export const useProductTypes = () => {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: getProductTypesAction
  });
}