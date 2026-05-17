import { beforeEach, describe, expect, test } from "vitest";
import AxiosMockAdapter from 'axios-mock-adapter';

import { backendApi } from "@/api/backendApi";
import { getProductByIdAction } from "./get-product-by-id.action";

const mockedProduct = {
  title: 'product mock',
  price: 10,
  stock: 10,
  description: 'description of the product',
  categories: [],
  images: ['image.jpg'],
  productType: {name: 'Book'},
  attributes: {},
  isActive: true
}

describe('getProductByIdAction', () => {

  const backendApiMock = new AxiosMockAdapter(backendApi);

  beforeEach(()=> {
    backendApiMock.reset();
  });

  test('should return a product when id is correct', async () => {
    backendApiMock.onGet('/products/123').reply(200, mockedProduct);

    const response = await getProductByIdAction('123');

    expect(response).toStrictEqual(mockedProduct)
  });

  test('should throw an error if id is not valid', async () => {
    await expect(getProductByIdAction('')).rejects.toThrow('id is required');
  })
});
