import { IProduct } from "./product";

export interface ICategory {
  id: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  description?: string;
  products: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}
