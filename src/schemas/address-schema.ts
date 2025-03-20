import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cep: z
    .string()
    .min(8, { message: "CEP inválido" })
    .regex(new RegExp("^\\d{5}-\\d{3}$"), { message: "CEP inválido" }),
  address: z
    .string()
    .min(3, { message: "Rua deve ter pelo menos 3 caracteres" }),
  number: z.string().min(1, { message: "Número é obrigatório" }),
  complement: z.string().optional(),
  district: z
    .string()
    .min(3, { message: "Bairro deve ter pelo menos 3 caracteres" }),
  city: z
    .string()
    .min(3, { message: "Cidade deve ter pelo menos 3 caracteres" }),
  state: z.string().min(2, { message: "Estado é obrigatório" }),
  principal: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
