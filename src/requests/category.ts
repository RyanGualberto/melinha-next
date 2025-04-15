import apiClient from "@/config/api-client";
import { ICategory } from "@/types/category";

export async function listCategories() {
  try {
    const response = await apiClient<Array<ICategory>>({
      method: "get",
      url: "/categories",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface createCategoryPayload {
  name: string;
  description: string;
  index: number;
}

export async function createCategory(data: createCategoryPayload) {
  try {
    const response = await apiClient<Array<ICategory>>({
      method: "post",
      url: "/categories",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function deleteCategory(id: string) {
  try {
    const response = await apiClient<Array<ICategory>>({
      method: "delete",
      url: `/categories/${id}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface updateCategoryPayload {
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export async function updateCategory(id: string, data: updateCategoryPayload) {
  try {
    const response = await apiClient<Array<ICategory>>({
      method: "patch",
      url: `/categories/${id}`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface updateCategoryOrderPayload {
  id: string;
  index: number;
}

export async function updateOrderCategory(
  data: Array<updateCategoryOrderPayload>
) {
  try {
    const response = await apiClient<Array<ICategory>>({
      method: "put",
      url: `/categories/order`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}
