import { IProductVariant } from "./product-variant";

export interface IProductVariantCategory {
  id: string;
  name: string;
  type: "SINGLE" | "MULTIPLE";
  max?: number;
  productVariants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
