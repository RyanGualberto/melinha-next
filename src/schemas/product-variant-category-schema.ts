import { z } from "zod";

export const productVariantCategorySchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  type: z.string(),
  max: z.number().optional(),
});

export type ProductVariantCategoryFormValues = z.infer<
  typeof productVariantCategorySchema
>;
