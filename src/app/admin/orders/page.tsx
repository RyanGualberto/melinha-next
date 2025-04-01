/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { OrderDialog } from "@/components/orders/order-dialog";
import { columns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/requests/order";
import { OrderStatus } from "@/types/order-status";
import OrdersResume from "@/components/orders/orders-resume";

export default function OrdersPage() {
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders(),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | keyof typeof OrderStatus
  >("all");
  const [deliveryMethod, setDeliveryMethod] = useState<
    "delivery" | "withdrawal" | "all"
  >("all");
  const [paymentMethod, setPaymentMethod] = useState<
    "all" | "money" | "card" | "pix"
  >("all");
  const [period, setPeriod] = useState<
    "all" | "today" | "yesterday" | "last3Days" | "lastMonth"
  >("all");

  const handleViewOrder = (pedido: any) => {
    setSelectedOrder(pedido);
    setDialogOpen(true);
  };

  const actionColumn = {
    id: "actions",
    header: "Ações",
    cell: ({ row }: any) => {
      const pedido = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleViewOrder(pedido)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  };

  const allColumns = [...columns, actionColumn];

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    let ordersFiltered = [...orders];

    if (period !== "all") {
      const startTime = new Date();
      let endTime = new Date();

      if (period === "today") {
        startTime.setHours(16, 0, 0, 0);
        endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + 1);
        endTime.setHours(2, 0, 0, 0);
      } else if (period === "yesterday") {
        startTime.setDate(startTime.getDate() - 1);
        startTime.setHours(16, 0, 0, 0);
        endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + 1);
        endTime.setHours(2, 0, 0, 0);
      } else if (period === "last3Days") {
        startTime.setDate(startTime.getDate() - 3);
        startTime.setHours(16, 0, 0, 0);
        endTime = new Date();
        endTime.setHours(2, 0, 0, 0);
      } else if (period === "lastMonth") {
        startTime.setMonth(startTime.getMonth() - 1);
        startTime.setHours(16, 0, 0, 0);
        endTime = new Date();
        endTime.setHours(2, 0, 0, 0);
      }

      ordersFiltered = ordersFiltered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startTime && orderDate < endTime;
      });
    }

    if (statusFilter !== "all") {
      ordersFiltered = ordersFiltered.filter(
        (order) => order.status === statusFilter
      );
    }

    if (deliveryMethod !== "all") {
      ordersFiltered = ordersFiltered.filter((order) =>
        order.isWithdrawal
          ? deliveryMethod === "withdrawal"
          : deliveryMethod === "delivery"
      );
    }

    if (paymentMethod !== "all") {
      ordersFiltered = ordersFiltered.filter(
        (order) => order.paymentMethod === paymentMethod
      );
    }

    return ordersFiltered;
  }, [orders, statusFilter, deliveryMethod, paymentMethod, period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie os pedidos da sua açaíteria
          </p>
        </div>
      </div>
      <OrdersResume />
      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Status</span>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as keyof typeof OrderStatus)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pedidos</SelectItem>
                <SelectItem value={OrderStatus.PENDING}>
                  Aguardando confirmação
                </SelectItem>
                <SelectItem value={OrderStatus.IN_PROGRESS}>
                  Em preparo
                </SelectItem>
                <SelectItem value={OrderStatus.DELIVERY_IN_PROGRESS}>
                  Em entrega
                </SelectItem>
                <SelectItem value={OrderStatus.COMPLETED}>Entregue</SelectItem>
                <SelectItem value={OrderStatus.CANCELED}>Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Método de entrega</span>
            <Select
              defaultValue="all"
              value={deliveryMethod}
              onValueChange={(value) =>
                setDeliveryMethod(value as "delivery" | "withdrawal" | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o método de entrega" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pedidos</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="withdrawal">Retirada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Método de pagamento</span>
            <Select
              defaultValue="all"
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "all" | "money" | "card" | "pix")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o método de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pedidos</SelectItem>
                <SelectItem value="money">Dinheiro</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="pix">Pix</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Periodo</span>
            <Select
              defaultValue="all"
              value={period}
              onValueChange={(value) =>
                setPeriod(
                  value as
                    | "all"
                    | "today"
                    | "yesterday"
                    | "last3Days"
                    | "lastMonth"
                )
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pedidos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="last3Days">Últimos 3 dias</SelectItem>
                <SelectItem value="lastMonth">Último mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={allColumns}
          data={filteredOrders || []}
          searchColumn="userSnapshot"
          searchPlaceholder="Buscar por cliente..."
        />
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Total de pedidos: {filteredOrders?.length || 0}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Total frete:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                filteredOrders?.reduce(
                  (acc, order) => acc + order.deliveryCost,
                  0
                ) || 0
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              Valor total:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                filteredOrders?.reduce((acc, order) => acc + order.total, 0) ||
                  0
              )}
            </p>
          </div>
        </div>
      </Card>

      {selectedOrder && (
        <OrderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
