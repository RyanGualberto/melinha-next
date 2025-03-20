import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
