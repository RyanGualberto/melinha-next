import { z } from "zod";

export const productVariantSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  price: z.coerce.number().min(0, { message: "Preço não pode ser negativo" }),
  status: z.string(),
  productId: z.string(),
  productVariantCategoryId: z.string(),
  image: z.string(),
});

export type ProductVariantFormValues = z.infer<typeof productVariantSchema>;
