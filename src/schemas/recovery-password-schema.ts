import { z } from "zod";

export const recoveryPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
});

export type RecoveryPasswordFormValues = z.infer<typeof recoveryPasswordSchema>;
