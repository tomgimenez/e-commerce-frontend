import { useQuery } from "@tanstack/react-query"
import { getProductsAction } from "../actions/get-products.action"
import { useParams, useSearchParams } from "react-router";

export const useProducts = () => {

  const [ searchParams ] = useSearchParams();
  const { gender } = useParams();

  const limit = searchParams.get('limit') || 8;
  const page = searchParams.get('page') || 1;
  const sizes = searchParams.get('sizes') || '';
  const filterPrices = searchParams.get('price') || 'any';
  const q = searchParams.get('query') || '';

  const offset = (Number(page) - 1) * Number(limit);
  let minPrice = undefined;
  let maxPrice = undefined;

  switch (filterPrices) {
    case '0-10':
      minPrice = 0;
      maxPrice = 10;
      break;
    case '10-15':
      minPrice = 10;
      maxPrice = 15;
      break;
    case '15-20':
      minPrice = 15;
      maxPrice = 20;
      break;      
    case '20+':
      minPrice = 20;
      break;      
  }


  return useQuery({
    queryKey: ['products', { offset, limit, gender, sizes, minPrice, maxPrice, q}],
    queryFn: () => getProductsAction({
      limit: isNaN(+limit) ? 8 : limit,
      offset: isNaN(offset) ? 0 : offset,
      gender: gender,
      sizes: sizes,
      minPrice: minPrice,
      maxPrice: maxPrice,
      q: q
    })
  });
}
