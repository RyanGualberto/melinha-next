import apiClient from "@/config/api-client";
import { IProductVariant } from "@/types/product-variant";

export async function listProductVariants() {
  try {
    const response = await apiClient<Array<IProductVariant>>({
      method: "get",
      url: "/product-variants",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface createProductVariantPayload {
  name: string;
  price: number;
  status: string;
  productId: string;
  productVariantCategoryId: string;
  image: string;
}

export async function createProductVariant(data: createProductVariantPayload) {
  try {
    const response = await apiClient<Array<IProductVariant>>({
      method: "post",
      url: "/product-variants",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function deleteProductVariant(id: string) {
  try {
    const response = await apiClient<Array<IProductVariant>>({
      method: "delete",
      url: `/product-variants/${id}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface updateProductVariantPayload {
  name: string;
  price: number;
  status: string;
  productId: string;
  productVariantCategoryId: string;
  image: string;
}

export async function updateProductVariant(
  id: string,
  data: updateProductVariantPayload
) {
  try {
    const response = await apiClient<Array<IProductVariant>>({
      method: "patch",
      url: `/product-variants/${id}`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}
