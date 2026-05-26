import type { Product } from "./product.interface";
import type { Book } from "./book.interface";

export const isBook = (product: Product): product is Book =>
  product.productType?.slug === 'book';