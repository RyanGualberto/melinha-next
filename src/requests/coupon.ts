import apiClient from "@/config/api-client";
import { ICoupon } from "@/types/coupon";

export async function listCoupons() {
  try {
    const response = await apiClient<Array<ICoupon>>({
      method: "get",
      url: "/coupons",
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function getCoupon(code: string) {
  try {
    const response = await apiClient<ICoupon>({
      method: "get",
      url: `/coupons/${code}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export type CouponType = "PERCENT" | "VALUE";

export interface createCouponPayload {
  code: string;
  type: "PERCENT" | "VALUE";
  active: boolean;
  description?: string | undefined;
  maxUses?: number | undefined;
  expiresAt?: Date | undefined;
}

export async function createCoupon(data: createCouponPayload) {
  try {
    const response = await apiClient<Array<ICoupon>>({
      method: "post",
      url: "/coupons",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function deleteCoupon(id: string) {
  try {
    const response = await apiClient<Array<ICoupon>>({
      method: "delete",
      url: `/coupons/${id}`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface updateCouponPayload {
  code: string;
  type: "PERCENT" | "VALUE";
  active: boolean;
  description?: string | undefined;
  maxUses?: number | undefined;
  expiresAt?: Date | undefined;
}

export async function updateCoupon(id: string, data: updateCouponPayload) {
  try {
    const response = await apiClient<Array<ICoupon>>({
      method: "patch",
      url: `/coupons/${id}`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export interface updateCouponOrderPayload {
  id: string;
  index: number;
}

export async function updateOrderCoupon(data: Array<updateCouponOrderPayload>) {
  try {
    const response = await apiClient<Array<ICoupon>>({
      method: "put",
      url: `/coupons/order`,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}
