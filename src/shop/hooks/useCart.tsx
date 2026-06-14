import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addItem, getCart, removeItem, updateItem } from "../api/cart.api"
import type { CartItem, CartItemDto } from "@/interfaces/cart.interface";

export const useCart = () => {

  const queryClient = useQueryClient();
  
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(),
    retry: false,
    staleTime: 1000 * 60 * 5
  });
  
  const addItemMutation = useMutation({
    mutationFn: (item: CartItemDto) => addItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: (cartItem: CartItem ) => updateItem(cartItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: string) => removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },  
  });  

  return { 
    cart,
    addItem: (item: CartItemDto, onSuccess?: () => void) => addItemMutation.mutate(item, { onSuccess }),
    removeItem: removeItemMutation.mutate,
    updateItem: updateItemMutation.mutate
  }
}


