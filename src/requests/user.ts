import apiClient from "@/config/api-client";
import { IUser } from "@/types/user";

export interface UsersResponse {
  id: string;
  role: "admin" | "user";
  email: string;
  phoneNumber: string;
  createdAt: Date;
  name: string;
  qtOrders: number;
  lastOrder: Date | null;
}

export interface ListUsersRequest {
  page: number;
  perPage: number;
  clientName: string;
}

export interface ListUsersResponse {
  pagination: {
    total: number;
  };
  data: Array<IUser>;
  totals: {
    totalUsers: number;
  };
}

export const listUsers = async (params: ListUsersRequest) => {
  try {
    const response = await apiClient<ListUsersResponse>({
      method: "get",
      url: "/users",
      params,
    });

    const formattedResponse: UsersResponse[] = response.data.data.map(
      (user: IUser) => ({
        id: user.id,
        role: user.role,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        qtOrders: user.orders.length,
        lastOrder:
          user.orders.length > 0
            ? new Date(
                user.orders.sort((a, b) => {
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })[0].createdAt
              )
            : null,
      })
    );

    return {
      ...response.data,
      data: formattedResponse,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
