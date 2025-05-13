"use client";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { listLastOrder } from "@/requests/order";
import { useCartContext } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";

export default function LastOrderSection() {
  const { push } = useRouter();
  const { handleAddManyCartItems } = useCartContext();
  const { data: lastOrder } = useQuery({
    queryKey: ["last", "order"],
    queryFn: async () => await listLastOrder(),
  });

  const repeatOrder = useCallback(() => {
    if (!lastOrder) return;
    handleAddManyCartItems(
      lastOrder.products.map((product) => ({
        id: product.id,
        price: product.price,
        product: product.product,
        observation: product.observation || undefined,
        productId: product.id,
        quantity: product.quantity,
        unitPrice: product.price,
        variants: product.variants.map((pv) => ({
          variantId: pv.id,
          variantName: pv.variantName,
          variantPrice: pv.variantPrice,
        })),
      }))
    );
    push("/cart");
  }, [lastOrder, handleAddManyCartItems, push]);

  if (!lastOrder) return null;

  // Formatar a data para exibição
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(lastOrder.createdAt));

  // Formatar o valor total
  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(lastOrder.total);

  // Obter os nomes dos itens para exibição
  const itemsText = lastOrder.products
    .map((item) => `${item.quantity}x ${item.productTitleSnapshot}`)
    .join(", ");
  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg p-6 my-8 border border-purple-200 dark:border-purple-800 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="h-14 w-14 rounded-full bg-purple-600/10 flex items-center justify-center flex-shrink-0">
          <RefreshCw className="h-7 w-7 text-purple-600" />
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-xl font-semibold">
            Que tal repetir seu último pedido?
          </h3>

          <div className="text-sm text-muted-foreground space-y-1">
            <p className="flex items-center">
              <Clock className="inline-block h-3.5 w-3.5 mr-1.5" />
              <span>{formattedDate}</span>
            </p>
            <p className="line-clamp-1">{itemsText}</p>
            <p className="font-medium text-foreground">{formattedTotal}</p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <Button
            type="button"
            onClick={repeatOrder}
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 group"
          >
            Pedir novamente
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <p className="text-xs text-center md:text-right text-muted-foreground mt-2">
            Você pode revisar os itens antes de confirmar
          </p>
        </div>
      </div>
    </div>
  );
}
