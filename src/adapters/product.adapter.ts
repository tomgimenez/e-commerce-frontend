import type { Product, ProductUI } from "@/interfaces/product.interface";

export const adaptProduct = (product: Product): ProductUI => {
  return {
    ...product,
    images: product.images.map(image => ({
      name: image,
      url: image.includes('http')
        ? image
        : `${import.meta.env.VITE_API_URL}/files/product/${image}`
    }))
  };
};