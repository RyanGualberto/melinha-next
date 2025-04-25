import { CouponType } from "@/requests/coupon";

export interface ICoupon {
  id: string;
  code: string;
  description?: string;
  discount: number;
  type: CouponType;
  maxUses?: number;
  usedCount: number;
  expiresAt?: Date;
  active?: boolean;
}
