import { backendApi } from "@/api/backendApi"

interface CreateOrderPayload {
  cart_id: string;
  address_id: string;
  shipping_method_id: number;
  payment_method: string;
}

interface CreateOrderResponse {
  init_point: string;
}

export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  const { data } = await backendApi.post<CreateOrderResponse>('/order', payload);
  return data;
}