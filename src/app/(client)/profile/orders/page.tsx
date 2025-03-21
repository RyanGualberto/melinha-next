"use client";

import { useState } from "react";
import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/requests/order";
import { CientOrderItem } from "@/components/orders/client-order-item";
import { Button } from "@/components/ui/button";

export default function PedidosPage() {
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );

  const toggleOrder = (id: string) => {
    setExpandedOrders({
      ...expandedOrders,
      [id]: !expandedOrders[id],
    });
  };

  return (
    <div className="container py-8 px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Meus Pedidos</h1>
        <p className="text-muted-foreground">
          Acompanhe o histórico e status dos seus pedidos
        </p>
      </div>

      <div className="space-y-6">
        {(orders || []).length > 0 ? (
          (orders || []).map((order) => (
            <CientOrderItem
              key={order.id}
              order={order}
              toggleOrder={toggleOrder}
              expandedOrders={expandedOrders}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              Você ainda não fez nenhum pedido
            </h2>
            <p className="text-muted-foreground mb-6">
              Que tal experimentar nossos deliciosos açaís?
            </p>
            <Button asChild className="bg-[#73067D] hover:bg-[#73067D]/80">
              <Link href="/">Ver Cardápio</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
