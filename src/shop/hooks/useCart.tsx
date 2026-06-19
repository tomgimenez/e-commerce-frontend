import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addItem, getCart, removeItem, updateItem } from "../api/cart.api"
import type { CartItem, CartItemDto } from "@/interfaces/cart.interface";
import { useCartStore } from "../store/cart.store";
import { useAuthStore } from "@/auth/store/auth.store";

export const useCart = () => {

  const queryClient = useQueryClient();
  const { guestItems, addGuestItem, updateGuestItem, removeGuestItem } = useCartStore();
  const { authStatus } = useAuthStore();

  const isLoggedIn = authStatus === 'authenticated';
  
  const { data: userCart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(),
    retry: false,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5
  });

  const cart = isLoggedIn ? userCart : { id: null, items: guestItems, updatedAt: new Date() };

  const handleAddItem = (item: CartItem, onSuccess?: () => void) => {
    if (isLoggedIn) {
      addItemMutation.mutate({
        productId: item.product.id,
        unitPrice: item.unitPrice,
        quantity: item.quantity
      }, { onSuccess })
    } else {
      addGuestItem(item);
      onSuccess?.();
    }
  }

  const handleUpdateItem = (item: CartItem) => {
    if (isLoggedIn)
      updateItemMutation.mutate(item);
    else
      updateGuestItem(item.product.id, item.quantity);
  }

  const handleRemoveItem = (item: CartItem) => {
    if (isLoggedIn) {
      removeItemMutation.mutate(item.id!)
    } else {
      removeGuestItem(item.product.id)
    }
  }
  
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
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateItem: handleUpdateItem
  }
}


