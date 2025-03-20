import apiClient from "@/config/api-client";
import { IProduct } from "@/types/product";

export async function listProducts() {
  try {
    const response = await apiClient<Array<IProduct>>({
      method: "get",
      url: "/products",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface createProductPayload {
  title: string;
  description: string;
  price: number;
  status: string;
  image: string;
  categoryId: string;
}

export async function createProduct(data: createProductPayload) {
  try {
    const response = await apiClient<Array<IProduct>>({
      method: "post",
      url: "/products",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const response = await apiClient<Array<IProduct>>({
      method: "delete",
      url: `/products/${id}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface updateProductPayload {
  title: string;
  description: string;
  price: number;
  status: string;
  image: string;
  categoryId?: string;
}

export async function updateProduct(id: string, data: updateProductPayload) {
  try {
    const response = await apiClient<Array<IProduct>>({
      method: "patch",
      url: `/products/${id}`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}
