import { OrderStatus } from "./order-status";
import { IProduct } from "./product";

export interface IOrder {
  id: string;
  userId: string;
  addressId?: string;
  addressSnapshot?: string;
  createdAt: string;
  deliveryCost: number;
  deliveryTime: number;
  discount: number;
  observation: string;
  paymentChange: number;
  paymentMethod: string;
  products: IOrderProduct[];
  status: keyof typeof OrderStatus;
  total: number;
  userSnapshot: string;
  updatedAt: string;
  isWithdrawal?: boolean;
}

export interface IOrderProduct {
  createdAt: string;
  id: string;
  observation: string | null;
  orderId: string;
  price: number;
  productId: string;
  product: IProduct;
  productPriceSnapshot: number;
  productTitleSnapshot: string;
  productVariantId: null;
  quantity: number;
  updatedAt: string;
  variants: Array<IOrderProductVariant>;
}

export interface IOrderProductVariant {
  createdAt: string;
  id: string;
  orderProductId: string;
  updatedAt: string;
  variantName: string;
  variantPrice: number;
}
