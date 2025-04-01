import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    lastName: z
      .string()
      .min(2, { message: "Sobrenome deve ter pelo menos 2 caracteres" }),
    phoneNumber: z
      .string()
      .min(15, { message: "Telefone deve ter pelo menos 16 caracteres" }),
    email: z
      .string()
      .min(1, { message: "Email é obrigatório" })
      .email({ message: "Email inválido" }),
    password: z
      .string()
      .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
