import { IProduct } from "./product";

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  products: IProduct[];
  createdAt: Date;
  updatedAt: Date;
}
