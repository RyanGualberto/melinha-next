import apiClient from "@/config/api-client";
import { IOrder } from "@/types/order";
import { OrderStatus } from "@/types/order-status";

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
  addressId?: string;
  products: OrderProductDto[];
  total: number;
  discount: number;
  deliveryCost: number;
  paymentMethod: string;
  paymentChange?: number;
  addressSnapshot?: string;
  orderObservation?: string;
  isWithdrawal?: boolean;
}

export async function createOrder(data: CreateOrderDto) {
  if (data.isWithdrawal) {
    data.deliveryCost = 0;
    delete data.addressSnapshot;
    delete data.addressId;
  }
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

export async function getCurrentUserOrders() {
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

export async function listOrders() {
  try {
    const response = await apiClient<Array<IOrder>>({
      method: "get",
      url: "/orders",
    });

    return response.data;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
}

export async function listNewOrders() {
  try {
    console.log("here");
    
    const response = await apiClient<Array<IOrder>>({
      method: "get",
      url: "/orders/new",
    });

    return response.data;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: keyof typeof OrderStatus
) {
  try {
    const response = await apiClient<IOrder>({
      method: "patch",
      url: `/orders/${orderId}`,
      data: { status },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
