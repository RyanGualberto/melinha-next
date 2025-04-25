"use client";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Clock, DollarSign } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/requests/settings";

export default function MenuPageStoreConfigSection() {
  const { data: storeConfig } = useQuery({
    queryKey: ["store-config"],
    queryFn: async () => await getSettings(),
  });

  if (!storeConfig) return null;

  return (
    <div className="mb-2.5">
      {storeConfig && !storeConfig.opened && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Loja Fechada</AlertTitle>
          <AlertDescription>
            Nossa loja está fechada no momento. Você pode navegar pelo cardápio,
            mas não será possível realizar pedidos.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <Badge
          variant="outline"
          className="flex items-center gap-1 px-3 py-1 text-sm bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300 border-amber-200 dark:border-amber-800"
        >
          <DollarSign className="h-3.5 w-3.5" />
          Pedido mínimo:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(storeConfig?.orderMinimum)}
        </Badge>

        <Badge className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-300 border-blue-200 dark:border-blue-800">
          <Clock className="h-3.5 w-3.5" />
          Tempo de entrega: {storeConfig?.deliveryTime} minutos
        </Badge>

        <Badge
          variant={storeConfig?.opened ? "default" : "destructive"}
          className={cn("px-3 py-1 text-sm", {
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800":
              storeConfig?.opened,
            "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300 border-red-200 dark:border-red-800":
              !storeConfig?.opened,
          })}
        >
          {storeConfig?.opened ? "Aberto" : "Fechado"}
        </Badge>
      </div>
    </div>
  );
}
