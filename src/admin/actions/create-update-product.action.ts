import { adaptProduct } from "@/adapters/product.adapter";
import { backendApi } from "@/api/backendApi";
import type { Product, ProductUI } from "@/interfaces/product.interface";

export const createUpdateProductAction = async (
  productLike: Partial<ProductUI> & { files?: File[] }
): Promise<ProductUI> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, user, images = [], files = [], ...rest } = productLike;

  const isCreating = id === 'new';

  rest.stock = Number(rest.stock || 0);
  rest.price = Number(rest.price || 0);

  // Preparar las imagenes
  const imagesToSave = images.map(img => img.name);

  if (files.length > 0) {
    const newImagesNames = await uploadFiles(files);
    imagesToSave.push(...newImagesNames);
  }

  const { data } = await backendApi<Product>({
    url: isCreating ? '/products' : `/products/${ id }`,
    method: isCreating ? 'POST' : 'PATCH',
    data: {
      ...rest,
      images: imagesToSave
    }
  });

  return adaptProduct(data);
}

interface FileUploadResponse {
  secureUrl: string;
  fileName:  string;
}

const uploadFiles = async (files: File[]) => {
  const uploadPromises = files.map(async file => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await backendApi<FileUploadResponse>({
      url: '/files/product',
      method: 'POST',
      data: formData
    });

    return data.fileName;
  });

  return await Promise.all(uploadPromises)
}
