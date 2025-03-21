/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Eye, Filter } from "lucide-react";
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

export default function OrdersPage() {
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => listOrders(),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>("todos");

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

  // Filtrar pedidos por status
  const filteredOrders =
    statusFilter === "todos"
      ? orders
      : (orders || []).filter((order) => order.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Gerencie os pedidos da sua açaíteria
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtrar por status:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os pedidos</SelectItem>
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

        <DataTable
          columns={allColumns}
          data={filteredOrders || []}
          searchColumn="userSnapshot"
          searchPlaceholder="Buscar por cliente..."
        />
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
