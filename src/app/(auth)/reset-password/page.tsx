"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/reset-password-schema";

export default function RecuperarSenha() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true);

    try {
      // Simulação de envio de email - aqui você faria a chamada para a API
      console.log("Recuperação de senha para:", data.email);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mostrar mensagem de sucesso
      setIsSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Recuperar Senha</CardTitle>
        <CardDescription>
          Digite seu email para receber um link de recuperação de senha
        </CardDescription>
      </CardHeader>

      {isSuccess ? (
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>
              Email enviado com sucesso! Verifique sua caixa de entrada e siga
              as instruções para redefinir sua senha.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-[#73067D] hover:text-[#73067D]/80 dark:text-purple-400"
            >
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="submit"
                className="w-full bg-[#73067D] hover:bg-[#73067D]/80"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Link de Recuperação"
                )}
              </Button>
              <div className="text-center text-sm">
                Lembrou sua senha?{" "}
                <Link
                  href="/login"
                  className="text-[#73067D] hover:text-[#73067D]/80 dark:text-purple-400"
                >
                  Voltar para o login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      )}
    </Card>
  );
}
