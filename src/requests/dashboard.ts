import apiClient from "@/config/api-client";

export interface GetDashboardResponse {
  totalClients: number;
  ordersLast30Days: number;
  ordersLastWeekend: number;
  revenueLast30Days: number;
  revenueLastWeekend: number;
  bestSellingItemLast30Days: BestSellingItemLast30Days;
  leastSellingItemLast30Days: LeastSellingItemLast30Days;
  bestSellingItemLastWeekend: BestSellingItemLastWeekend;
  leastSellingItemLastWeekend: LeastSellingItemLastWeekend;
  bestSellingNeighborhoodLast30Days: [string, number];
  leastSellingNeighborhoodLast30Days: [string, number];
  bestWorstSellingNeighborhoodLastWeekend: [string, number];
  leastSellingNeighborhoodLastWeekend: [string, number];
  averageTicket: number;
}

export interface BestSellingItemLast30Days {
  _sum: Sum;
  productTitleSnapshot: string;
}

export interface Sum {
  quantity: number;
}

export interface LeastSellingItemLast30Days {
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

export async function getDashboard() {
  try {
    const response = await apiClient<GetDashboardResponse>({
      method: "get",
      url: "/dashboard",
    });

    return response.data;
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw error;
  }
}
