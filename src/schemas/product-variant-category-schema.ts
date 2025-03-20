import { z } from "zod";

export const productVariantCategorySchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
});

export type ProductVariantCategoryFormValues = z.infer<
  typeof productVariantCategorySchema
>;
