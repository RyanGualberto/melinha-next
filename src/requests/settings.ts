import apiClient from "@/config/api-client";

export interface SettingsResponse {
  instagram: string;
  email: string;
  whatsapp: string;
  deliveryTime: string;
  orderMinimum: number;
  opened: boolean;
}

export async function getSettings() {
  try {
    const response = await apiClient<SettingsResponse>({
      method: "get",
      url: "/settings",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
}

export interface updateSettingsPayload {
  instagram: string;
  email: string;
  whatsapp: string;
  deliveryTime: string;
  orderMinimum: number;
  opened: boolean;
}

export async function updateSettings(data: updateSettingsPayload) {
  try {
    const response = await apiClient({
      method: "patch",
      url: "/settings",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}
