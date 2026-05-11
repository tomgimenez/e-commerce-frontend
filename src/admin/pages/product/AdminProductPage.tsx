// https://github.com/Klerith/bolt-product-editor

import { Navigate, useParams } from 'react-router';

import { useProduct } from '@/admin/hooks/useProduct';
import { CustomLoading } from '@/components/custom/CustomLoading';
import { ProductForm } from './ui/ProductForm';

export const AdminProductPage = () => {
  const { id } = useParams();

  const title = id === 'new' ? 'Add product' : 'Edit product';
  const subtitle =
    id === 'new'
      ? 'Add a new product to your inventory.'
      : 'Edit the details of your product and save the changes.';

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