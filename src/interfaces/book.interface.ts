import type { ProductUI } from "./product.interface";

export type Book = Omit<ProductUI, 'productType' | 'attributes'> & {
  productType: {
    slug: 'book';
    name: 'Book';
  };

  attributes: BookAttributes;
}

interface BookAttributes {
  author: string;
  rating: number;
  reviews: number;
  isBestseller: boolean;
  pages: string;
  publisher: string;
}