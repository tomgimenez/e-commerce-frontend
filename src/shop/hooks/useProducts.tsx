import { useQuery } from "@tanstack/react-query"
import { getProductsAction } from "../actions/get-products.action"
import { useParams, useSearchParams } from "react-router";

export const useProducts = () => {

  const [ searchParams ] = useSearchParams();
  const { gender } = useParams();

  const limit = searchParams.get('limit') || 9;
  const page = searchParams.get('page') || 1;
  const sizes = searchParams.get('sizes') || '';
  const filterPrices = searchParams.get('price') || 'any';
  const q = searchParams.get('query') || '';

  const offset = (Number(page) - 1) * Number(limit);
  let minPrice = undefined;
  let maxPrice = undefined;

  switch (filterPrices) {
    case '0-50':
      minPrice = 0;
      maxPrice = 50;
      break;
    case '50-100':
      minPrice = 50;
      maxPrice = 100;
      break;
    case '100-200':
      minPrice = 100;
      maxPrice = 200;
      break;      
    case '200+':
      minPrice = 200;
      break;      
  }


  return useQuery({
    queryKey: ['products', { offset, limit, gender, sizes, minPrice, maxPrice, q}],
    queryFn: () => getProductsAction({
      limit: isNaN(+limit) ? 9 : limit,
      offset: isNaN(offset) ? 0 : offset,
      gender: gender,
      sizes: sizes,
      minPrice: minPrice,
      maxPrice: maxPrice,
      q: q
    })
  });
}
