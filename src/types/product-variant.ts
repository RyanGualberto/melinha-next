import { IProduct } from "./product";
import { IProductVariantCategory } from "./product-variant-category";

export interface IProductVariant {
  id: string;
  name: string;
  price: number;
  status: string;
  productId: string;
  productVariantCategoryId: string;
  productVariantCategory: IProductVariantCategory;
  product: IProduct;
  image: string;
}
