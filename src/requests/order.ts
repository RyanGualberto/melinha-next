import apiClient from "@/config/api-client";
import { IOrder } from "@/types/order";

interface OrderProductVariantDto {
  variantName: string;
  variantPrice: number;
}

interface OrderProductDto {
  productObservation?: string;
  productId: string;
  quantity: number;
  price: number;
  variants: OrderProductVariantDto[];
}

export interface CreateOrderDto {
  addressId: string;
  products: OrderProductDto[];
  total: number;
  discount: number;
  deliveryCost: number;
  paymentMethod: string;
  paymentChange?: number;
  addressSnapshot: string;
  orderObservation?: string;
}

export async function createOrder(data: CreateOrderDto) {
  try {
    const response = await apiClient({
      method: "post",
      url: "/orders",
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const response = await apiClient<Array<IOrder>>({
      method: "get",
      url: "/orders/current-user",
    });

    return response.data;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
}
