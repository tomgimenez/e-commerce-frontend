import { getProductsAction } from "@/shop/actions/get-products.action";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router"

export const useAdminProducts = () => {
  const [searchParams] = useSearchParams();

  const limit = searchParams.get('limit') || 9;
  const page = searchParams.get('page') || 1;
  const q = searchParams.get('query') || '';

  const offset = (Number(page) - 1) * Number(limit);

  return useQuery({
    queryKey: ['products', { offset, limit, q}],
    queryFn: () => getProductsAction({
      limit: isNaN(+limit) ? 9 : limit,
      offset: isNaN(offset) ? 0 : offset,
      q: q
    })
  });
}