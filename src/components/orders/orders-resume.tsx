import React from "react";
import { ChefHat, Clock, Truck } from "lucide-react";
import { OrdersResumeColumn } from "./order-resume-column";
import { useQuery } from "@tanstack/react-query";
import { listOrdersInProgress } from "@/requests/order";

export default function OrdersResume() {
  const { data: orders } = useQuery({
    queryKey: ["orders", "in", "progress"],
    queryFn: async () => await listOrdersInProgress(),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Pedidos Ativos</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <OrdersResumeColumn
          badgeColors="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
          cardHeaderColors="bg-amber-50 dark:bg-amber-950/20"
          emptyText="Nenhum pedido aguardando confirmação"
          orders={orders?.waiting || []}
          icon={<Clock className="h-5 w-5 mr-2 text-amber-500" />}
          title="Aguardando Confirmação"
        />
        <OrdersResumeColumn
          badgeColors="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          cardHeaderColors="bg-blue-50 dark:bg-blue-950/20"
          emptyText="Nenhum pedido em preparo"
          orders={orders?.inProgress || []}
          icon={<ChefHat className="h-5 w-5 mr-2 text-blue-500" />}
          title="Em Preparo"
        />
        <OrdersResumeColumn
          badgeColors="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          cardHeaderColors="bg-green-50 dark:bg-green-950/20"
          emptyText="Nenhum pedido em entrega"
          orders={orders?.inDelivery || []}
          icon={<Truck className="h-5 w-5 mr-2 text-green-500" />}
          title="Saiu para Entrega"
        />
      </div>
    </div>
  );
}
