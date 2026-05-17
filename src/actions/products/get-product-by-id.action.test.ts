import { beforeEach, describe, expect, test } from "vitest";
import AxiosMockAdapter from 'axios-mock-adapter';

import { backendApi } from "@/api/backendApi";
import { getProductByIdAction } from "./get-product-by-id.action";

const BASE_URL = import.meta.env.VITE_API_URL;

describe('getProductByIdAction', () => {

  const backendApiMock = new AxiosMockAdapter(backendApi);

  beforeEach(()=> {
    backendApiMock.reset();
  });

  test('should return a product when id is correct', async () => {
    backendApiMock.onGet('/products/123').reply(200, {
      title: 'product mock',
      price: 10,
      stock: 10,
      description: 'description of the product',
      categories: [],
      images: ['image.jpg'],
      productType: {name: 'Book'},
      attribures: {},
      isActive: true
    });

    const response = await getProductByIdAction('123');

    expect(response).toStrictEqual({
      title: 'product mock',
      price: 10,
      stock: 10,
      description: 'description of the product',
      categories: [],
      images: [{
        name: 'image.jpg',
        url: `${BASE_URL}/files/product/image.jpg`
      }],
      productType: {name: 'Book'},
      attribures: {},
      isActive: true
    })
  });

  test('should throw an error if id is not valid', async () => {
    await expect(getProductByIdAction('')).rejects.toThrow('id is required');
  })
});
