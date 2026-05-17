import type { ProductUI } from "./product.interface";
import type { Book } from "./book.interface";

export const isBook = (product: ProductUI): product is Book =>
  product.productType?.slug === 'book';