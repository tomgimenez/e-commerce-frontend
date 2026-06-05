import { backendApi } from "@/api/backendApi";
import type { AuthResponse } from "../interfaces/auth.reponse";

export const registerAction = async (
  name: string,
  lastname: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {

    console.log(name)
    const { data } = await backendApi.post<AuthResponse>('/auth/register', {
      name,
      lastname,
      email,
      password
    });

    return data;

  } catch (error) {

    console.log(error);
    throw error;

  }
}
