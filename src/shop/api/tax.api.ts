import { backendApi } from "@/api/backendApi"
import type { Tax } from "../../interfaces/tax.interface"

export const getTaxes = async () => {
  const { data } = await backendApi.get<Tax[]>("/taxes")
  
  return data;
}