import { describe, expect, test } from "vitest";
import AxiosMockAdapter from 'axios-mock-adapter';

import { backendApi } from "@/api/backendApi";
import type { ProductType } from "@/interfaces/product.interface";
import { createUpdateProductAction } from "./create-update-product.action";

const productMockToSave = {
  title: 'product mock',
  description: 'description of the product',
  price: 10,
  stock: 10,
  images: [{name: 'image1.jpg', url: 'image.jpg'}],
}

const productMock = {
  title: 'product mock',
  price: 10,
  stock: 10,
  images: ['image1.jpg'],
  description: 'description of the product',
  categories: [],
  productType: {name: 'Book'} as ProductType,
  attributes: {},
  isActive: true
};

describe('createUpdateProductAction', () => {

  const backendApiMock = new AxiosMockAdapter(backendApi);
  
  test('should call POST method when creating new product', async () => {

    backendApiMock.onPost('/products').reply(200, productMock);

    await createUpdateProductAction({id: 'new', ...productMockToSave});

    expect(backendApiMock.history.post).toHaveLength(1);
    expect(backendApiMock.history.post[0].url).toBe('/products');

  });

  test('should not upload files when no files are provided', async () => {
    backendApiMock.onPost('/products').reply(200, productMock);

    await createUpdateProductAction({ id: 'new', files: [], ...productMockToSave });

    expect(backendApiMock.history.post.some(r => r.url === '/files/product')).toBe(false);
  });

  test('should call PATCH method when saving existent product', async () => {
    const id = '123';
    backendApiMock.onPatch(`/products/${id}`).reply(200, productMock);

    await createUpdateProductAction({id: id, ...productMockToSave});

    expect(backendApiMock.history.patch).toHaveLength(1);
    expect(backendApiMock.history.patch[0].url).toBe(`/products/${id}`);
  });

  test('should upload files when new files are provided', async () => {
    const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
    
    backendApiMock.onPost('/files/product').reply(200, { fileName: 'uploaded.jpg', secureUrl: 'http://...' });
    backendApiMock.onPost('/products').reply(200, productMock);

    await createUpdateProductAction({ id: 'new', files: [file], ...productMockToSave });

    expect(backendApiMock.history.post.some(r => r.url === '/files/product')).toBe(true);
  });
})