import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductByIdAction } from "../../actions/products/get-product-by-id.action";
import type { ProductUI } from "@/interfaces/product.interface";
import { createUpdateProductAction } from "../actions/create-update-product.action";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const useProduct = (id: string) => {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['product', {id}],
    queryFn: () => getProductByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!id
  });

  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (product: ProductUI) => {
      queryClient.invalidateQueries({queryKey: ['product', { id: product.id }]});
      queryClient.setQueryData(['product', {id: product.id}], product);
    },
    onError: (error) => {
      console.log(error);
      toast.error('Error saving product. Please try again.');
    }
  });

  const isPending = mutation.isPending;

  const handleSubmit = async (productLike: Partial<ProductUI> & { files?: File[] }) => {

    await mutation.mutateAsync(productLike, {
      onSuccess: () => {
        toast.success('Product saved correctly');
        navigate('/admin/products')
      },
      onError: (error) => { console.log(error) }
    });
  }

  return {
    ...query,
    isPending,
    handleSubmit
  }
}
