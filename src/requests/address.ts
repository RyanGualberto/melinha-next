import apiClient from "@/config/api-client";
import { IAddress } from "@/types/address";

export async function listAddresses() {
  try {
    const response = await apiClient<Array<IAddress>>({
      method: "get",
      url: "/addresses",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
}

export interface createAddressPayload {
  address: string;
  number: string;
  complement?: string;
  reference?: string;
  district: string;
  city: string;
  state: string;
  name: string;
  zipCode: string;
  principal: boolean;
}

export async function createAddress(data: createAddressPayload) {
  try {
    const response = await apiClient<Array<IAddress>>({
      method: "post",
      url: "/addresses",
      data: {
        ...data,
        country: "Brasil",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
}

export async function deleteAddress(id: string) {
  try {
    const response = await apiClient<Array<IAddress>>({
      method: "delete",
      url: `/addresses/${id}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}

export interface updateAddressPayload {
  address: string;
  number: string;
  complement?: string;
  reference?: string;
  district: string;
  city: string;
  state: string;
  name: string;
  zipCode: string;
  principal: boolean;
}

export async function updateAddress(id: string, data: updateAddressPayload) {
  try {
    const response = await apiClient<Array<IAddress>>({
      method: "patch",
      url: `/addresses/${id}`,
      data: {
        ...data,
        country: "Brasil",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
}
