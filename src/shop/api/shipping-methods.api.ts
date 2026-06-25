import { backendApi } from "@/api/backendApi"
import type { ShippingMethod } from "@/interfaces/shipping-method.interface"

export const getShippingMethods = async () => {
  const { data } = await backendApi.get<ShippingMethod[]>('/shipping');

  return data;
}