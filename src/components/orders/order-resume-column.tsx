import { Pedido } from "@/app/admin/orders/columns";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import OrderResumeItem from "./order-resume-item";
import { Badge } from "../ui/badge";

export function OrdersResumeColumn({
  badgeColors,
  icon,
  title,
  orders,
  cardHeaderColors,
  emptyText,
}: {
  cardHeaderColors: string;
  badgeColors: string;
  icon: React.ReactNode;
  title: string;
  orders: Pedido[];
  emptyText: string;
}) {
  return (
    <Card>
      <CardHeader className={cardHeaderColors}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            {icon}
            {title}
          </CardTitle>
          <Badge variant="outline" className={badgeColors}>
            {orders.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {orders.map((order) => (
            <OrderResumeItem key={order.id} order={order} />
          ))}
          {orders.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              {emptyText}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
