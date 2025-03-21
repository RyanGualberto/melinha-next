import { IProduct } from "./product";

export interface Cart {
  addressId: string;
  addressDistrict: string;
  products: CartProduct[];
  discount?: number;
  deliveryCost: number;
  paymentMethod: string;
  paymentChange?: string;
  observation?: string;
}

export interface CartProduct {
  id: string;
  productId: string;
  product: IProduct;

  quantity: number;
  price: number;
  variants: CartProductVariant[];
  observation?: string;
}

export interface CartProductVariant {
  variantId: string;
  variantName: string;
  variantPrice: number;
}
