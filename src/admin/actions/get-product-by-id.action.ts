import { adaptProduct } from "@/adapters/product.adapter";
import { tesloApi } from "@/api/tesloApi";
import type { Product, ProductUI } from "@/interfaces/product.interface";

export const getProductByIdAction = async (id: string): Promise<ProductUI> => {

  if (!id) throw new Error('id is required');

  if (id === 'new') {
    return {
      id: null,
      title: '',
      price: 0,
      description: '',
      slug: '',
      stock: 0,
      sizes: [],
      gender: 'men',
      tags: [],
      images: []
    } as unknown as ProductUI;
  }

  const { data } = await tesloApi.get<Product>(`/products/${id}`);
  
  return adaptProduct(data);
}