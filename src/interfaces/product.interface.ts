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
  tags:        string[];
  images:      string[];
  user:        User;
  productType: ProductType;
  attributes:  object;
  isActive:    boolean;
  createdAt:   Date;
  updatedAt:   Date;
  deletedAt:   Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  schema: ProductSchema;
}

export type ProductSchema = Record<string, ProductSchemaField>;

export interface ProductSchemaField {
  type: string;
  required: boolean;
  label: string;
}

export type ProductUI = Omit<Product, 'images'> & {
  images: {
    name: string;
    url: string;
  }[];
};

export type ProductTypesResponse = ProductType[];
