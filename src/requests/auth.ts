import apiClient from "@/config/api-client";
import { IUser } from "@/types/user";

export async function getCurrentUser() {
  try {
    const response = await apiClient({
      method: "get",
      url: "/auth/me",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface registerPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface registerResponse {
  user: IUser;
  accessToken: string;
}

export async function register(data: registerPayload) {
  try {
    const response = await apiClient<registerResponse>({
      method: "post",
      url: "/auth/register",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export interface loginPayload {
  email: string;
  password: string;
}

export async function login(data: loginPayload) {
  try {
    const response = await apiClient({
      method: "post",
      url: "/auth/login",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export async function recoveryPassword(email: string) {
  try {
    const response = await apiClient({
      method: "post",
      url: "/auth/request-password-reset",
      data: {
        email,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error recovery password:", error);
    throw error;
  }
}

export async function resetPassword(newPassword: string, token: string) {
  try {
    const response = await apiClient({
      method: "post",
      url: "/auth/reset-password",
      data: {
        newPassword,
        token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error recovery password:", error);
    throw error;
  }
}
