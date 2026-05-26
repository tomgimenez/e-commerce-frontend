import { getProductByIdAction } from "@/actions/products/get-product-by-id.action";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export const useProduct = () => {
  const { id } = useParams();
   
  return useQuery({
    queryKey: ['product', {id}],
    queryFn: () => getProductByIdAction(id ?? ''),
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
