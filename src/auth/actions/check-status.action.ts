import { backendApi } from "@/api/backendApi";
import type { AuthResponse } from "../interfaces/auth.reponse";

export const checkStatusAction = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem('token');

  if (!token) throw new Error('no token found');

  try {
    const { data } = await backendApi.get<AuthResponse>('/auth/check-status')

    localStorage.setItem('token', data.token);

    return data;
    
  } catch (error) {
    localStorage.removeItem('token');
    throw new Error('token expired or not valid', { cause: error });
  }
}