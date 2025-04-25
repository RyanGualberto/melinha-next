import apiClient from "@/config/api-client";
import { IProductVariant } from "@/types/product-variant";

export interface ListProductVariantsRequest {
  page: number;
  perPage: number;
  productVariantName: string;
}

export interface ListProductVariantsResponse {
  pagination: {
    total: number;
  };
  data: Array<IProductVariant>;
  totals: {
    totalProductVariants: number;
  };
}

export async function listProductVariants(params: ListProductVariantsRequest) {
  try {
    const response = await apiClient<ListProductVariantsResponse>({
      method: "get",
      url: "/product-variants",
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching product variants:", error);
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

export async function createManyProductVariant(
  data: createProductVariantPayload[]
) {
  try {
    const response = await apiClient<Array<IProductVariant>>({
      method: "post",
      url: "/product-variants/batch",
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
      url: `/product-variants/single/${id}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function deleteManyProductVariant(ids: string[]) {
  try {
    const response = await apiClient<Array<IProductVariant>>({
      method: "delete",
      url: `/product-variants/batch`,
      data: {
        ids,
      },
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
      url: `/product-variants/single/${id}`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface updateManyProductVariantPayload {
  price: number;
  status: string;
  productId: string;
  productVariantCategoryId: string;
}

export async function updateManyProductVariant(
  ids: string[],
  data: updateManyProductVariantPayload
) {
  try {
    const response = await apiClient<Array<IProductVariant>>({
      method: "patch",
      url: `/product-variants/batch/`,
      data: {
        ids,
        ...data,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}
