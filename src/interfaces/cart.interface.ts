import type { Product } from "@/interfaces/product.interface";

export interface Cart {
  id:        string;
  updatedAt: Date;
  items:     CartItem[];
}

export interface CartItem {
  id?:       string;
  quantity:  number;
  unitPrice: number;
  product:   Product;
}

export interface CartItemDto {
  productId: string;
  unitPrice: number;
  quantity: number;
}
