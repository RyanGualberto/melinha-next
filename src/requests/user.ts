import apiClient from "@/config/api-client";
import { IUser } from "@/types/user";

export interface ListUsersResponse {
  id: string;
  role: "admin" | "user";
  email: string;
  phoneNumber: string;
  createdAt: Date;
  name: string;
  qtOrders: number;
  lastOrder: Date | null;
}

export const listUsers = async () => {
  try {
    const response = await apiClient<IUser[]>({
      method: "get",
      url: "/users",
    });

    const formattedResponse: ListUsersResponse[] = response.data.map(
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

    return formattedResponse;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
