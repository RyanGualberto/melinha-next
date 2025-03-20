import { IProductVariant } from "./product-variant";

export interface IProductVariantCategory {
  id: string;
  name: string;
  productVariants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
