import apiClient from "@/config/api-client";
import { IProductVariantCategory } from "@/types/product-variant-category";

export async function listProductVariantCategories() {
  try {
    const response = await apiClient<Array<IProductVariantCategory>>({
      method: "get",
      url: "/product-variant-categories",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface createProductVariantCategoryPayload {
  name: string;
}

export async function createProductVariantCategory(
  data: createProductVariantCategoryPayload
) {
  try {
    const response = await apiClient<Array<IProductVariantCategory>>({
      method: "post",
      url: "/product-variant-categories",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function deleteProductVariantCategory(id: string) {
  try {
    const response = await apiClient<Array<IProductVariantCategory>>({
      method: "delete",
      url: `/product-variant-categories/${id}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface updateProductVariantCategoryPayload {
  name: string;
}

export async function updateProductVariantCategory(
  id: string,
  data: updateProductVariantCategoryPayload
) {
  try {
    const response = await apiClient<Array<IProductVariantCategory>>({
      method: "patch",
      url: `/product-variant-categories/${id}`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}
