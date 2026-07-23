import type { Product } from "./product.interface";

export type Book = Omit<Product, 'attributes'> & {
  attributes: BookAttributes;
}

interface BookAttributes {
  author: string;
  isBestseller: boolean;
  pages: string;
  publisher: string;
}