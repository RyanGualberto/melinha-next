import React from "react";
import { ChefHat, Clock, Truck } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { orders } from "@/mock/orders";
import { Pedido } from "@/app/admin/orders/columns";
import { OrdersResumeColumn } from "./order-resume-column";

const ordersWaiting: Pedido[] = orders;
const ordersInProgress: Pedido[] = orders;
const ordersInDelivery: Pedido[] = orders;

export default function OrdersResume() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Pedidos Ativos</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <OrdersResumeColumn
          badgeColors="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
          cardHeaderColors="bg-amber-50 dark:bg-amber-950/20"
          emptyText="Nenhum pedido aguardando confirmação"
          orders={ordersWaiting}
          icon={<Clock className="h-5 w-5 mr-2 text-amber-500" />}
          title="Aguardando Confirmação"
        />
        <OrdersResumeColumn
          badgeColors="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          cardHeaderColors="bg-blue-50 dark:bg-blue-950/20"
          emptyText="Nenhum pedido em preparo"
          orders={ordersInProgress}
          icon={<ChefHat className="h-5 w-5 mr-2 text-blue-500" />}
          title="Em Preparo"
        />
        <OrdersResumeColumn
          badgeColors="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          cardHeaderColors="bg-green-50 dark:bg-green-950/20"
          emptyText="Nenhum pedido em entrega"
          orders={ordersInDelivery}
          icon={<Truck className="h-5 w-5 mr-2 text-green-500" />}
          title="Saiu para Entrega"
        />
      </div>

      <div className="mt-4 text-center">
        <Button asChild variant="outline">
          <Link href="/admin/orders">Ver todos os pedidos</Link>
        </Button>
      </div>
    </div>
  );
}
