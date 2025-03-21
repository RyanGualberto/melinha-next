import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChefHat, Clock, Truck } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import OrderResumeItem from "./order-resume-item";
import { orders } from "@/mock/orders";
import { Pedido } from "@/app/admin/orders/columns";

const ordersWaiting: Pedido[] = orders;
const ordersInProgress: Pedido[] = orders;
const ordersInDelivery: Pedido[] = orders;

export default function OrdersResume() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Pedidos Ativos</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Pedidos Aguardando Confirmação */}
        <Card>
          <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                Aguardando Confirmação
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
              >
                {ordersWaiting.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {ordersWaiting.map((order) => (
                <OrderResumeItem key={order.id} order={order} />
              ))}
              {ordersWaiting.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum pedido aguardando confirmação
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pedidos Em Preparo */}
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-blue-500" />
                Em Preparo
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              >
                {ordersInProgress.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {ordersInProgress.map((order) => (
                <OrderResumeItem key={order.id} order={order} />
              ))}
              {ordersInProgress.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum pedido em preparo
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pedidos Saiu para Entrega */}
        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center">
                <Truck className="h-5 w-5 mr-2 text-green-500" />
                Saiu para Entrega
              </CardTitle>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                {ordersInDelivery.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {ordersInDelivery.map((order) => (
                <OrderResumeItem key={order.id} order={order} />
              ))}
              {ordersInDelivery.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  Nenhum pedido em entrega
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-center">
        <Button asChild variant="outline">
          <Link href="/admin/orders">Ver todos os pedidos</Link>
        </Button>
      </div>
    </div>
  );
}
