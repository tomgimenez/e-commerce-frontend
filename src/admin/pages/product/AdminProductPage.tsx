// https://github.com/Klerith/bolt-product-editor

import { Navigate, useParams } from 'react-router';

import { useProduct } from '@/admin/hooks/useProduct';
import { CustomLoading } from '@/components/custom/CustomLoading';
import { ProductForm } from './ui/ProductForm';
// import type { Product } from '@/interfaces/product.interface';

export const AdminProductPage = () => {
  const { id } = useParams();

  const title = id === 'new' ? 'Nuevo producto' : 'Editar producto';
  const subtitle =
    id === 'new'
      ? 'Aquí puedes crear un nuevo producto.'
      : 'Aquí puedes editar el producto.';

  const {
    isLoading,
    isError,
    data: product,
    handleSubmit,
    isPending
  } = useProduct(id ?? '');

  if (isError) return <Navigate to={'/admin/products'} />;

  if (isLoading) return <CustomLoading />;

  if (!product) return <Navigate to={'/admin/products'} />;

  return <ProductForm
    title={title}
    subtitle={subtitle}
    product={product}
    isPending={isPending}
    onSubmit={handleSubmit}
  />
  
};