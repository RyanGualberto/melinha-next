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
import { Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/schemas/reset-password-schema";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/requests/auth";

export default function ChangePassword() {
  const {
    mutateAsync: resetPasswordMutation,
    isSuccess,
    isPending,
  } = useMutation({
    mutationKey: ["password", "reset"],
    mutationFn: async (data: { newPassword: string; token: string }) =>
      await resetPassword(data.newPassword, data.token),
  });

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormValues) {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      await resetPasswordMutation({
        newPassword: data.password,
        token: token,
      });
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Alterar Senha</CardTitle>
        <CardDescription>
          Digite sua nova senha abaixo para alterar sua senha
        </CardDescription>
      </CardHeader>

      {isSuccess ? (
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-900">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>Senha Alterada com sucesso!</AlertDescription>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        autoComplete="password"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmação de senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="******"
                        type="password"
                        autoComplete="password"
                        disabled={isPending}
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
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  "Alterar Senha"
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
