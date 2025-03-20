import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  description: z
    .string()
    .min(5, { message: "Descrição deve ter pelo menos 5 caracteres" }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
