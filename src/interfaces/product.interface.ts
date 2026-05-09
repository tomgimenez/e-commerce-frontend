import type { User } from "./user.interface";

export interface Product {
  id:          string;
  title:       string;
  price:       number;
  description: string;
  slug:        string;
  stock:       number;
  tags:        string[];
  images:      string[];
  user:        User;
}

export type ProductUI = Omit<Product, 'images'> & {
  images: {
    name: string;
    url: string;
  }[];
};
