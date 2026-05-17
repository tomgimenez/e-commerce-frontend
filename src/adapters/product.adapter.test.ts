import { describe, expect, test } from "vitest";
import { adaptProduct } from "./product.adapter";
import type { Product } from "@/interfaces/product.interface";

const BASE_URL = import.meta.env.VITE_API_URL;
const productMock = {
  title: 'product mock',
  price: 10,
  stock: 10,
  images: ['image1.jpg', 'image2.jpg']
} as Product;

describe('product adapter', () => {
  
  test('should return the product with correct image objects', () => {
    const productResult = adaptProduct(productMock);

    expect(productResult.images).toStrictEqual([
        {name: 'image1.jpg', url:`${BASE_URL}/files/product/image1.jpg`},
        {name: 'image2.jpg', url: `${BASE_URL}/files/product/image2.jpg`}
      ])
  });

  test('should preserve basic fields', () => {
    const result = adaptProduct(productMock);
    expect(result.title).toBe(productMock.title);
    expect(result.price).toBe(productMock.price);
  });

  test('should handle empty images array', () => {
    const result = adaptProduct({ ...productMock, images: [] });
    expect(result.images).toEqual([]);
  });

});
