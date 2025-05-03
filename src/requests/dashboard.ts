import apiClient from "@/config/api-client";

export interface GetDashboardResponse {
  totalClients: number;
  ordersPeriod: number;
  revenuePeriod: number;
  bestSellingItemPeriod?: BestSellingItemPeriod;
  leastSellingItemPeriod?: LeastSellingItemPeriod;
  bestSellingNeighborhoodPeriod: [string, number];
  leastSellingNeighborhoodPeriod: [string, number];
  averageTicket: number;
  totalWorkedDays: number;
  deliveryFixedTotalCost: number;
  totalDeliveryCost: number;
  totalDeliveryCostMoreDeliveryFixedTotalCost: number;
  totalCost: number;
  realProfit: number;
}

export interface BestSellingItemPeriod {
  _sum: Sum;
  productTitleSnapshot: string;
}

export interface Sum {
  quantity: number;
}

export interface LeastSellingItemPeriod {
  _sum: Sum2;
  productTitleSnapshot: string;
}

export interface Sum2 {
  quantity: number;
}

export interface BestSellingItemLastWeekend {
  _sum: Sum3;
  productTitleSnapshot: string;
}

export interface Sum3 {
  quantity: number;
}

export interface LeastSellingItemLastWeekend {
  _sum: Sum4;
  productTitleSnapshot: string;
}

export interface Sum4 {
  quantity: number;
}

export async function getDashboard(params: {
  from: string | undefined;
  to: string | undefined;
}) {
  try {
    const response = await apiClient<GetDashboardResponse>({
      method: "get",
      url: "/dashboard",
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw error;
  }
}
