import type { ProductUI } from "./product.interface";

export interface Book extends ProductUI {
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
}