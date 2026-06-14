import { backendApi } from "@/api/backendApi"
import type { Cart, CartItem, CartItemDto } from "@/interfaces/cart.interface"

export const getCart = async () => {
  const { data } = await backendApi.get<Cart>('/cart');

  return data;
}

export const addItem = (dto: CartItemDto) =>
  backendApi.post('/cart/add-item', dto);

export const updateItem = (cartItem: CartItem) => 
  backendApi.patch(`/cart/update-item/${cartItem.id}`, {
    quantity: cartItem.quantity,
    productId: cartItem.product.id,
    unitPrice: Number(cartItem.unitPrice),
  });

export const removeItem = (cartItemId: string) =>
  backendApi.delete(`/cart/delete-item/${cartItemId}`);
