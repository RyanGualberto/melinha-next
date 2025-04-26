import apiClient from "@/config/api-client";
import { IOrder } from "@/types/order";
import { OrderStatus } from "@/types/order-status";

export interface OrderProductVariantDto {
  variantName: string;
  variantPrice: number;
}

export interface OrderProductDto {
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
  couponId?: string;
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

export interface ListOrdersResponse {
  pagination: {
    total: number;
  };
  data: Array<IOrder>;
  totals: {
    totalSales: number;
    deliveryCost: number;
  };
}

export interface ListOrdersRequest {
  page: number;
  perPage: number;
  customerName: string;
  status: "all" | keyof typeof OrderStatus;
  deliveryMethod: "delivery" | "withdrawal" | "all";
  paymentMethod: "all" | "money" | "card" | "pix";
  period: "all" | "today" | "yesterday" | "last3Days" | "lastMonth";
}

export async function listOrders(params: ListOrdersRequest) {
  try {
    const response = await apiClient<ListOrdersResponse>({
      method: "get",
      url: "/orders",
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
}
export interface ListOrdersInProgress {
  waiting: Array<IOrder>;
  inProgress: Array<IOrder>;
  inDelivery: Array<IOrder>;
}

export async function listOrdersInProgress() {
  try {
    const response = await apiClient<ListOrdersInProgress>({
      method: "get",
      url: "/orders/in-progress",
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
