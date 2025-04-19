/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { BookText, Eye, PlusCircle, RefreshCcw } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { IAddress } from "@/types/address";
import { IUser } from "@/types/user";
import { IOrder } from "@/types/order";
import Link from "next/link";

export default function OrdersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [customerName, setCustomerName] = useState("");
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

  const {
    data: orders,
    refetch,
    isPending: loadingOrders,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () =>
      await listOrders({
        page,
        perPage,
        customerName,
        status: statusFilter,
        deliveryMethod,
        paymentMethod,
        period: period,
      }),
  });

  const handleViewOrder = (pedido: IOrder) => {
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

  useEffect(() => {
    refetch();
  }, [
    statusFilter,
    deliveryMethod,
    paymentMethod,
    period,
    page,
    perPage,
    customerName,
    refetch,
  ]);

  const handleCopyDeliveryReport = () => {
    const deliveryReport = orders?.data
      .filter(
        (order) =>
          order.status !== "CANCELED" &&
          !order.isWithdrawal &&
          order.deliveryCost > 0 &&
          order.addressSnapshot
      )
      .map((order) => {
        const addressSnapshot: IAddress = JSON.parse(
          order.addressSnapshot || ""
        );
        const userSnapshot: IUser = JSON.parse(order.userSnapshot);
        return `${userSnapshot.firstName} ${userSnapshot.lastName} - ${
          addressSnapshot.district
        } - ${new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(order.deliveryCost)}`;
      });
    const deliveryReportString = (deliveryReport || [""]).join("\n");
    navigator.clipboard.writeText(deliveryReportString);
    alert("Relatório de fretes copiado para a área de transferência!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie os pedidos da sua açaíteria
          </p>
        </div>
        <Button
          variant="outline"
          className={cn("hidden md:inline-flex", {
            "animate-pulse": loadingOrders,
          })}
          onClick={() => refetch()}
        >
          <RefreshCcw
            className={cn("h-4 w-4", {
              "animate-spin": loadingOrders,
            })}
          />
          Atualizar
        </Button>
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
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Relatório de fretes</span>
            <Button onClick={handleCopyDeliveryReport} variant="secondary">
              <BookText className="h-4 w-4 mr-2" />
              Copiar
            </Button>
          </div>
          <div>
            <Link href="/admin/orders/create" passHref>
              <Button>
                <PlusCircle />
                Novo pedido manual
              </Button>
            </Link>
          </div>
        </div>

        <DataTable
          columns={allColumns}
          data={orders?.data || []}
          length={orders?.pagination.total}
          searchColumn="userSnapshot"
          searchPlaceholder="Buscar por cliente..."
          onFilterChange={(filters) => {
            setCustomerName(filters.toString());
          }}
          onPageChange={(value) => setPage(value)}
          onPageSizeChange={(value) => setPerPage(value)}
        />
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Total de pedidos: {orders?.pagination.total || 0}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Total frete:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(orders?.totals.deliveryCost || 0)}
            </p>
            <p className="text-sm text-muted-foreground">
              Valor total:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(orders?.totals.totalSales || 0)}
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
