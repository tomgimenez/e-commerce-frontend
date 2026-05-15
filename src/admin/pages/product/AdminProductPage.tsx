import { Navigate, useParams } from 'react-router';

import { useProduct } from '@/admin/hooks/useProduct';
import { CustomLoading } from '@/components/custom/CustomLoading';
import { ProductForm } from './form/ProductForm';

export const AdminProductPage = () => {
  const { id } = useParams();
  const isNew = id === 'new';

  const title = isNew ? 'Add product' : 'Edit product';
  const subtitle =
    isNew
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

  if (isNew) {
    return <ProductForm
      mode="create"
      title={title}
      subtitle={subtitle}
      isPending={isPending}
      onSubmit={handleSubmit}
    />
  }

  if (isLoading) return <CustomLoading />;

  if (!product) return <Navigate to={'/admin/products'} />;

  return <ProductForm
    mode="edit"
    title={title}
    subtitle={subtitle}
    product={product}
    isPending={isPending}
    onSubmit={handleSubmit}
  />
};