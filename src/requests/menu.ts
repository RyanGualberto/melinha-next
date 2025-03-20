import apiClient from "@/config/api-client";
import { ICategory } from "@/types/category";

export interface IMenuResponse {
  categories: Array<ICategory>;
}

export const listMenu = async () => {
  try {
    const response = await apiClient<IMenuResponse>({
      method: "get",
      url: "/menu",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
