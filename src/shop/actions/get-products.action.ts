import { adaptProduct } from "@/adapters/product.adapter";
import { tesloApi } from "@/api/tesloApi"
import type { ProductsResponse, ProductsResponseUI } from "@/interfaces/products.response";

interface Options {
  limit?: number | string;
  offset?: number | string;
  gender?: string;
  sizes?: string;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  q?: string | undefined;
}

export const getProductsAction = async (options: Options): Promise<ProductsResponseUI> => {

  const { limit, offset, gender, sizes, minPrice, maxPrice, q } = options;

  const { data } = await tesloApi.get<ProductsResponse>('/products', {
    params: {
      limit, offset, gender, sizes, minPrice, maxPrice, q
    }
  });

  const productsAdapted = data.products.map(product => (adaptProduct(product)));

  return {
    ...data,
    products: productsAdapted
  }
}