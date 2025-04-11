import { ICategory } from "./category";
import { IProductVariant } from "./product-variant";

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  image: string;
  categoryId: string;
  category: ICategory;
  cost: number;
  productVariants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
