import { IProduct } from "./product";

export interface Cart {
  addressId: string;
  addressDistrict: string;
  products: CartProduct[];
  discount?: number;
  deliveryCost: number;
  paymentMethod: "" | "money" | "card" | "pix";
  paymentChange?: string;
  observation?: string;
  isWithdrawal: boolean;
}

export interface CartProduct {
  id: string;
  productId: string;
  product: IProduct;

  quantity: number;
  price: number;
  unitPrice: number;
  variants: CartProductVariant[];
  observation?: string;
}

export interface CartProductVariant {
  variantId: string;
  variantName: string;
  variantPrice: number;
}
