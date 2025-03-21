"use client";

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
import { Loader2 } from "lucide-react";
import { LoginFormValues, loginSchema } from "@/schemas/login-schema";
import { useMutation } from "@tanstack/react-query";
import { login, loginPayload } from "@/requests/auth";
import { AxiosError } from "axios";
import { useAuthContext } from "@/contexts/user-context";

export default function Login() {
  const { afterLogin } = useAuthContext();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: async (data: loginPayload) => await login(data),
    onSuccess: afterLogin,
    onError: (error) => {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.status === 400) {
          form.setError("email", {
            message: "Email ou senha inválidos",
          });
          form.setError("password", {
            message: "Email ou senha inválidos",
          });
        }

        return;
      }

      form.setError("email", {
        message: "Erro ao fazer login",
      });
      form.setError("password", {
        message: "Erro ao fazer login",
      });
    },
  });

  async function onSubmit(data: LoginFormValues) {
    await mutateAsync(data);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
        <CardDescription>
          Entre com seu email e senha para acessar sua conta
        </CardDescription>
      </CardHeader>
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
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="flex items-center justify-between">
                        <FormLabel>Senha</FormLabel>
                        <Link
                          href="/reset-password"
                          className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
                        >
                          Esqueceu a senha?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                Registre-se
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
