"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Banknote, CreditCard, QrCode } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/requests/settings";

export default function PaymentMethods() {
  const { data: storeConfig } = useQuery({
    queryKey: ["store-config"],
    queryFn: async () => await getSettings(),
  });

  if (!storeConfig) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <CreditCard className="mr-2 h-5 w-5 text-[#73067D]" />
          Métodos de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center p-3 rounded-md border">
            <Banknote className="h-8 w-8 mb-2 text-green-600" />
            <span className="text-sm font-medium">Dinheiro</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-md border">
            <CreditCard className="h-8 w-8 mb-2 text-blue-600" />
            <span className="text-sm font-medium">Cartão</span>
          </div>
          <div className="flex flex-col items-center text-center p-3 rounded-md border">
            <QrCode className="h-8 w-8 mb-2 text-[#73067D]" />
            <span className="text-sm font-medium">PIX</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-md">
          <p className="text-sm font-medium flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
            Pedido Mínimo:
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(storeConfig.orderMinimum)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
