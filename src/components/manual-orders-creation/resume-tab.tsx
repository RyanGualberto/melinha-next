import React from "react";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { CartResume } from "@/app/admin/orders/create/cart-resume";
import { UsersResponse } from "@/requests/user";
import { Badge } from "../ui/badge";
import { IAddress } from "@/types/address";
import { OrderProductDto } from "@/requests/order";
import { UseFormReturn } from "react-hook-form";
import { formatAddress } from "@/utils/convert-json-address-to-string";
import { ManualOrderFormValues } from "@/app/admin/orders/create/page";

export default function ResumeTab({
  selectedClient,
  isLoading,
  isWithdrawal,
  selectedAddress,
  manualAddress,
  products,
  paymentMethod,
  form,
  calculateSubTotal,
  calculateTotal,
  deliveryCost,
  discount,
  previousStep,
}: {
  selectedClient: UsersResponse | null;
  isLoading: boolean;
  isWithdrawal: boolean;
  selectedAddress: IAddress | null;
  manualAddress: string;
  products: OrderProductDto[];
  paymentMethod: string;
  form: UseFormReturn<ManualOrderFormValues, unknown, undefined>;
  calculateSubTotal: () => number;
  calculateTotal: () => number;
  deliveryCost: number;
  discount: number;
  previousStep: () => void;
}) {
  return (
    <TabsContent value="resume" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
          <CardDescription>
            Revise as informações antes de criar o pedido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-3">
                Informações do Cliente
              </h3>
              <div className="rounded-md border p-4">
                {selectedClient ? (
                  <div>
                    <p className="font-medium">{selectedClient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.phoneNumber}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Pedido sem cliente vinculado
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Entrega</h3>
              <div className="rounded-md border p-4">
                {isWithdrawal ? (
                  <div className="flex items-center">
                    <Badge className="bg-green-100 text-green-700 mr-2">
                      Retirada
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Cliente irá retirar na loja
                    </p>
                  </div>
                ) : selectedAddress ? (
                  <div>
                    <p className="font-medium">{selectedAddress.name}</p>
                    <p className="text-sm">
                      {selectedAddress.address}, {selectedAddress.number}
                    </p>
                    <p className="text-sm">
                      {selectedAddress.district}, {selectedAddress.city} -{" "}
                      {selectedAddress.state}
                    </p>
                  </div>
                ) : manualAddress ? (
                  <p>{formatAddress(manualAddress)}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum endereço selecionado
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3">Produtos</h3>
            <CartResume products={products} />
          </div>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-3">Pagamento</h3>
              <div className="rounded-md border p-4">
                <p className="font-medium">
                  Método:{" "}
                  {paymentMethod === "dinheiro"
                    ? "Dinheiro"
                    : paymentMethod === "cartao"
                    ? "Cartão"
                    : "PIX"}
                </p>
                {paymentMethod === "dinheiro" &&
                  (form.watch("paymentChange") || 0) > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Troco para:{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(form.watch("paymentChange") || 0)}
                    </p>
                  )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Valores</h3>
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(calculateSubTotal())}
                  </span>
                </div>
                {!isWithdrawal && (
                  <div className="flex justify-between">
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
                  <div className="flex justify-between">
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
                <Separator />
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
            </div>
          </div>

          {form.watch("orderObservation") && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-medium mb-3">Observações</h3>
                <div className="rounded-md border p-4">
                  <p>{form.watch("orderObservation")}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={previousStep}>
            Voltar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Criando pedido..." : "Criar Pedido"}
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
