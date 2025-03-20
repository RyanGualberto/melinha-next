import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z
    .string()
    .min(5, { message: "Descrição deve ter pelo menos 5 caracteres" }),
  price: z.coerce.number().positive({ message: "Preço deve ser positivo" }),
  status: z.string(),
  image: z.string(),
  categoryId: z.string(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
