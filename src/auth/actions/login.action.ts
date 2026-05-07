import { backendApi } from "@/api/backendApi"
import type { AuthResponse } from "../interfaces/auth.reponse";

export const loginAction = async (
  email:string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data } = await backendApi.post<AuthResponse>('/auth/login', {
      email,
      password
    });
    
    return data;
    
  } catch (error) {
    console.log({error})

    throw error;
  }
}