import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { IOrder } from "@/types/order";
import { OrderStatus } from "@/types/order-status";
import { IAddress } from "@/types/address";
import { Badge } from "../ui/badge";

const getStatusInfo = (status: keyof typeof OrderStatus) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Aguardando Confirmação",
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
        icon: Clock,
      };
    case "IN_PROGRESS":
      return {
        label: "Em Preparo",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        icon: Package,
      };
    case "DELIVERY_IN_PROGRESS":
      return {
        label: "Saiu para Entrega",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
        icon: Truck,
      };
    case "COMPLETED":
      return {
        label: "Entregue",
        color:
          "bg-purple-100 text-[#73067D]/80 dark:bg-purple-900 dark:text-purple-300",
        icon: CheckCircle2,
      };
    case "CANCELED":
      return {
        label: "Cancelado",
        color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
        icon: XCircle,
      };
    default:
      return {
        label: "Desconhecido",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        icon: Clock,
      };
  }
};

export function CientOrderItem({
  order,
  expandedOrders,
  toggleOrder,
}: {
  order: IOrder;
  expandedOrders: Record<string, boolean>;
  toggleOrder: (id: string) => void;
}) {
  const statusInfo = getStatusInfo(order.status);
  const isExpanded = expandedOrders[order.id] || false;
  const address: IAddress = JSON.parse(order.addressSnapshot);

  return (
    <Card key={order.id}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
            <CardDescription>
              {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </CardDescription>
          </div>
          <Badge className={`${statusInfo.color} flex items-center gap-1`}>
            <statusInfo.icon className="h-3.5 w-3.5" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <p className="text-sm font-medium">Total</p>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(order.total)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Forma de Pagamento</p>
            <p>{order.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Endereço</p>
            <p>{address.name}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full flex items-center justify-center"
          onClick={() => toggleOrder(order.id)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Ocultar Detalhes
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Ver Detalhes
            </>
          )}
        </Button>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <Separator />

            <div>
              <h4 className="font-medium mb-2">Itens do Pedido</h4>
              <div className="space-y-2">
                {order.products.map((orderProduct) => (
                  <div key={orderProduct.id}>
                    <div className="flex justify-between">
                      <span>
                        {orderProduct.quantity}x{" "}
                        {orderProduct.productTitleSnapshot}
                      </span>
                      <span>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(orderProduct.price)}
                      </span>
                    </div>
                    <ul>
                      {orderProduct.variants.map((variant) => (
                        <li
                          key={variant.id}
                          className="text-sm text-muted-foreground"
                        >
                          {variant.variantName} -{" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(variant.variantPrice)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Endereço de Entrega</h4>
              <p>{address.address}</p>
              <p>
                {address.district}, {address.city}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
