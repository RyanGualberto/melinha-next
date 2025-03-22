"use client";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Clock, Mail, Phone, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/utils/format-number";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/requests/settings";

const configSchema = z.object({
  instagram: z.string().min(1, { message: "Instagram é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  whatsapp: z.string().min(10, { message: "WhatsApp inválido" }),
  deliveryTime: z
    .number()
    .min(1, { message: "Tempo de entrega é obrigatório" }),
  opened: z.boolean(),
  orderMinimum: z.number().min(0, { message: "Valor mínimo inválido" }),
});

type ConfigFormValues = z.infer<typeof configSchema>;

export default function ConfiguracoesPage() {
  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => await getSettings(),
  });
  const { mutateAsync: updateSettingsMutation, isPending: isUpdatePending } =
    useMutation({
      mutationFn: async (data: ConfigFormValues) => {
        await updateSettings(data);
      },
      mutationKey: ["update", "settings"],
    });
  const isLoading = useMemo(
    () => isUpdatePending || isSettingsLoading,
    [isUpdatePending, isSettingsLoading]
  );

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      deliveryTime: settings?.deliveryTime ?? 30,
      email: settings?.email ?? "",
      instagram: settings?.instagram ?? "",
      whatsapp: formatPhoneNumber(settings?.whatsapp ?? ""),
      opened: settings?.opened ?? false,
      orderMinimum: settings?.orderMinimum ?? 0,
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        deliveryTime: settings.deliveryTime,
        email: settings.email,
        instagram: settings.instagram,
        whatsapp: formatPhoneNumber(settings.whatsapp),
        opened: settings.opened,
        orderMinimum: settings.orderMinimum,
      });
    }
  }, [settings, form]);

  async function onSubmit(data: ConfigFormValues) {
    try {
      await updateSettingsMutation({
        ...data,
        orderMinimum: Number(data.orderMinimum),
        deliveryTime: Number(data.deliveryTime),
      });
      toast("As configurações foram atualizadas com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast("Ocorreu um erro ao salvar as configurações. Tente novamente.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua açaíteria
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>
            Configure as informações de contato e funcionamento da sua açaíteria
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input icon="@" placeholder="seuinstagram" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome de usuário do Instagram da sua açaíteria
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          icon={<Mail size={14} className="opacity-90" />}
                          type="email"
                          placeholder="contato@acaiteria.com.br"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Email de contato para clientes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          icon={<Phone size={14} className="opacity-90" />}
                          placeholder="(00) 00000-0000"
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            e.target.value = formatted;
                            onChange(e);
                          }}
                          maxLength={15}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Número de WhatsApp para contato e pedidos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Entrega</FormLabel>
                      <FormControl>
                        <Input
                          icon={<Clock size={14} className="opacity-90" />}
                          placeholder="30-45 minutos"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            field.onChange(Number(value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Tempo estimado para entrega dos pedidos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="orderMinimum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pedido Minimo</FormLabel>
                    <FormControl>
                      <Input
                        icon="R$"
                        placeholder="00,00"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(Number(value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor mínimo para pedidos na açaíteria
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="opened"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Status de Funcionamento
                      </FormLabel>
                      <FormDescription>
                        Defina se a açaíteria está aberta ou fechada para
                        pedidos
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-4 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horários de Funcionamento</CardTitle>
          <CardDescription>
            Configure os horários de funcionamento da sua açaíteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-8 text-center">
            <h2 className="text-lg font-medium">
              Funcionalidade em desenvolvimento
            </h2>
            <p className="text-muted-foreground mt-2">
              A configuração de horários estará disponível em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
