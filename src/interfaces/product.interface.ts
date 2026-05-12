import type { User } from "./user.interface";

export interface Product {
  id:          string;
  title:       string;
  price:       number;
  description: string;
  slug:        string;
  stock:       number;
  rating:      number;
  reviews:     number;
  categories:  Category[];
  image:       string;
  tags:        string[];
  images:      string[];
  user:        User;
  productType: ProductType;
  attributes:  Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

interface Category {
  id: string;
  name: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  schema: ProductSchema;
}

export interface ProductSchemaField {
  type: string;
  required: boolean;
  label: string;
  options?: string[];
}

export type ProductSchema = Record<string, ProductSchemaField>;

export type ProductUI = Omit<Product, 'images'> & {
  images: {
    name: string;
    url: string;
  }[];
};

export type Size = "L" | "M" | "S" | "XL" | "XS" | "XXL";

export type Gender = 'kid' | 'men' | 'women' | 'unisex';
