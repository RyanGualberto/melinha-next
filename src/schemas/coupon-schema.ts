import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z.string().optional(),
  type: z.enum(["PERCENT", "VALUE"]),
  maxUses: z.number().optional(),
  expiresAt: z.date().optional(),
  active: z.boolean(),
  discount: z.number().min(0, {
    message: "Desconto deve ser maior que 0",
  }),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
