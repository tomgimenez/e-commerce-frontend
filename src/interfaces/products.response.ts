import type { Product, ProductUI } from "./product.interface";

export interface ProductsResponse {
  count:    number;
  pages:    number;
  products: Product[];
}

export type ProductsResponseUI = Omit<ProductsResponse, 'products'> & {
  products: ProductUI[];
}
