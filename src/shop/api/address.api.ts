import { backendApi } from "@/api/backendApi"
import type { Address } from "@/interfaces/address.interface"

export type AddressPayload = Omit<Address, "id">;

export const getAddresses = async () => {
  const { data } = await backendApi.get<Address[]>("/address")

  return data;
}

export const createAddress = (address: AddressPayload) => 
  backendApi.post("/address", address)

export const updateAddress = (addressId: string, address: AddressPayload) =>
  backendApi.patch(`/address/${addressId}`, address)

export const deleteAddress = (addressId: string) =>
  backendApi.delete(`/address/${addressId}`)
