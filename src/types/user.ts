import { Pedido } from "@/app/admin/orders/columns";

export interface IUser {
  id: string;
  role: "admin" | "user";
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  orders: Pedido[];
}
