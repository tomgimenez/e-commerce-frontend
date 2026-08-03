import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addItem, getCart, removeItem, updateItem } from "../api/cart.api"
import type { CartItem, CartItemDto } from "@/interfaces/cart.interface";
import { useCartStore } from "../store/cart.store";
import { useAuthStore } from "@/auth/store/auth.store";

export const useCart = () => {

  const queryClient = useQueryClient();
  const { guestItems, isMergingGuestItems, addGuestItem, updateGuestItem, removeGuestItem, mergeGuestItems } = useCartStore();
  const { authStatus } = useAuthStore();
  const hasMergedGuestCart = useRef(false);
  const mergeGuestItemsFn = mergeGuestItems ?? (async () => undefined);

  const isLoggedIn = authStatus === 'authenticated';
  
  const { data: userCart } = useQuery({
    queryKey: ['cart'],
    queryFn: () => getCart(),
    retry: false,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
    select: (data) => data || { id: null, items: [], updatedAt: null }
  });

  const cart = isLoggedIn ? userCart : { id: null, items: guestItems, updatedAt: new Date() };

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

  useEffect(() => {
    if (authStatus !== 'authenticated') {
      hasMergedGuestCart.current = false;
      return;
    }

    if (hasMergedGuestCart.current || guestItems.length === 0 || isMergingGuestItems) {
      return;
    }

    hasMergedGuestCart.current = true;

    void mergeGuestItemsFn((item) =>
      addItemMutation.mutateAsync({
        productId: item.product.id,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })
    );
  }, [addItemMutation, authStatus, guestItems.length, isMergingGuestItems, mergeGuestItemsFn]);

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
  return { 
    cart,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateItem: handleUpdateItem
  }
}


