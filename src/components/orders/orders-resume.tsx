import React, { useMemo } from "react";
import { ChefHat, Clock, Truck } from "lucide-react";
import { OrdersResumeColumn } from "./order-resume-column";
import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/requests/order";
import { OrderStatus } from "@/types/order-status";

export default function OrdersResume() {
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await listOrders(),
  });
  const ordersFiltered = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const startDate = new Date(now);
    if (currentHour < 2) {
      startDate.setDate(startDate.getDate() - 1);
    }
    startDate.setHours(9, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(2, 0, 0, 0);

    const ordersInPeriod = orders?.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate < endDate;
    });
    
    return {
      waiting: ordersInPeriod?.filter(
        (order) => order.status === OrderStatus.PENDING
      ),
      inProgress: ordersInPeriod?.filter(
        (order) => order.status === OrderStatus.IN_PROGRESS
      ),
      inDelivery: ordersInPeriod?.filter(
        (order) => order.status === OrderStatus.DELIVERY_IN_PROGRESS
      ),
    };
  }, [orders]);

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Pedidos Ativos</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <OrdersResumeColumn
          badgeColors="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
          cardHeaderColors="bg-amber-50 dark:bg-amber-950/20"
          emptyText="Nenhum pedido aguardando confirmação"
          orders={ordersFiltered.waiting || []}
          icon={<Clock className="h-5 w-5 mr-2 text-amber-500" />}
          title="Aguardando Confirmação"
        />
        <OrdersResumeColumn
          badgeColors="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          cardHeaderColors="bg-blue-50 dark:bg-blue-950/20"
          emptyText="Nenhum pedido em preparo"
          orders={ordersFiltered.inProgress || []}
          icon={<ChefHat className="h-5 w-5 mr-2 text-blue-500" />}
          title="Em Preparo"
        />
        <OrdersResumeColumn
          badgeColors="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          cardHeaderColors="bg-green-50 dark:bg-green-950/20"
          emptyText="Nenhum pedido em entrega"
          orders={ordersFiltered.inDelivery || []}
          icon={<Truck className="h-5 w-5 mr-2 text-green-500" />}
          title="Saiu para Entrega"
        />
      </div>
    </div>
  );
}
