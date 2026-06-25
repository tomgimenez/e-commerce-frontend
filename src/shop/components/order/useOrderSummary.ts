import type { Tax } from "@/interfaces/tax.interface";
import { getShippingMethods } from "@/shop/api/shipping-methods.api";
import { getTaxes } from "@/shop/api/tax.api";
import { useCart } from "@/shop/hooks/useCart";
import { useCheckoutStore } from "@/shop/store/checkout.store";
import { useQuery } from "@tanstack/react-query";

export const useOrderSummary = () => {
  const { cart } = useCart();
  const cartItems = cart?.items || [];
  const { shippingMethodId } = useCheckoutStore();

  const { data: shippingMethods } = useQuery({
    queryKey: ['shipping-methods'],
    queryFn: getShippingMethods,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: taxes } = useQuery<Tax[]>({
    queryKey: ['taxes'],
    queryFn: getTaxes,
    retry: false,
    staleTime: 1000 * 60 * 5,
    select: (data) => data ?? []
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const selectedShippingMethod = shippingMethods?.find(s => s.id === shippingMethodId);
  const shippingCost = selectedShippingMethod?.price ?? 0;

  const totalTaxes = taxes?.reduce(
    (sum, tax) => sum + Math.round(subtotal * tax.rate * 100) / 100,
    0
  ) ?? 0;

  const total = subtotal + shippingCost + totalTaxes;

  return { cartItems, subtotal, shippingCost, taxes, total };
}