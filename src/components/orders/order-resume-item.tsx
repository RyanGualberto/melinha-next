import React, { useState } from "react";
import { Button } from "../ui/button";
import { OrderDialog } from "./order-dialog";
import { IOrder } from "@/types/order";
import { IUser } from "@/types/user";

export default function OrderResumeItem({ order }: { order: IOrder }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const handleViewOrder = (pedido: IOrder) => {
    setSelectedOrder(pedido);
    setDialogOpen(true);
  };
  const user: IUser = JSON.parse(order.userSnapshot);

  return (
    <div key={order.id} className="p-4 hover:bg-muted/50">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium">Pedido {user.firstName}</div>
        <div className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="text-sm mb-1">
        {user.firstName} {user.lastName}
      </div>
      <div className="text-sm text-muted-foreground mb-2 line-clamp-1">
        {order.products
          .map((product) => product.productTitleSnapshot)
          .join(", ")}
      </div>
      <div className="flex justify-between items-center">
        <div className="font-medium">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(order.total)}
        </div>
        <Button
          onClick={() => handleViewOrder(order)}
          size="sm"
          variant="outline"
        >
          Detalhes
        </Button>
      </div>
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
