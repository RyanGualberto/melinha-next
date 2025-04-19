import React from "react";
import { TabsContent } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { UseFormReturn } from "react-hook-form";
import { Textarea } from "../ui/textarea";

export default function PaymentTab({
  calculateSubTotal,
  calculateTotal,
  deliveryCost,
  discount,
  form,
  previousStep,
  isWithdrawal,
  paymentMethod,
  nextStep,
}: {
  form: UseFormReturn<
    {
      isWithdrawal: boolean;
      paymentMethod: "pix" | "money" | "card";
      discount: number;
      deliveryCost: number;
      orderObservation?: string | undefined;
      paymentChange?: number | undefined;
      clienteId?: string | undefined;
      addressId?: string | undefined;
      addressSnapshot?: string | undefined;
    },
    unknown,
    undefined
  >;
  calculateSubTotal: () => number;
  calculateTotal: () => number;
  deliveryCost: number;
  discount: number;
  previousStep: () => void;
  nextStep: () => void;
  paymentMethod: string;
  isWithdrawal: boolean;
}) {
  return (
    <TabsContent value="payment" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pagamento e Entrega</CardTitle>
          <CardDescription>
            Configure as opções de pagamento e entrega
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Método de Pagamento</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="money" />
                      </FormControl>
                      <FormLabel className="font-normal">Dinheiro</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="card" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Cartão (na entrega)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="pix" />
                      </FormControl>
                      <FormLabel className="font-normal">PIX</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {paymentMethod === "money" && (
            <FormField
              control={form.control}
              name="paymentChange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Troco para</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        R$
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        className="pl-9"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Deixe em branco se não precisar de troco
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Separator />

          {!isWithdrawal && (
            <FormField
              control={form.control}
              name="deliveryCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Entrega</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        R$
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        className="pl-9"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desconto</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      R$
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-9"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>Desconto em valor (R$)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <FormField
            control={form.control}
            name="orderObservation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações do Pedido</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Alguma observação para o pedido? (opcional)"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-md bg-muted p-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(calculateSubTotal())}
              </span>
            </div>
            {!isWithdrawal && (
              <div className="flex justify-between mb-2">
                <span>Taxa de entrega:</span>
                <span>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(deliveryCost)}
                </span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between mb-2">
                <span>Desconto:</span>
                <span className="text-red-500">
                  -{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(discount)}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(calculateTotal())}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={previousStep}>
            Voltar
          </Button>
          <Button
            type="button"
            onClick={nextStep}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Próximo: Resumo
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
