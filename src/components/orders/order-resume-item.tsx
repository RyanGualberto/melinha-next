import React, { useState } from "react";
import { Button } from "../ui/button";
import { OrderDialog } from "./order-dialog";
import { Pedido } from "@/app/admin/orders/columns";

export default function OrderResumeItem({ order }: { order: Pedido }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const handleViewPedido = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async (pedidoId: string, novoStatus: string) => {
    // Simulação de atualização de status
    console.log(`Atualizando status do pedido ${pedidoId} para ${novoStatus}`);
    // Aqui você faria a chamada para a API  };
  };

  return (
    <div key={order.id} className="p-4 hover:bg-muted/50">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium">Pedido #{order.id}</div>
        <div className="text-sm text-muted-foreground">
          {new Date(order.data).toLocaleDateString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      </div>
      <div className="text-sm mb-1">{order.cliente.nome}</div>
      <div className="text-sm text-muted-foreground mb-2 line-clamp-1">
        {order.items.map((item) => item.nome).join(", ")}
      </div>
      <div className="flex justify-between items-center">
        <div className="font-medium">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(order.valor)}
        </div>
        <Button
          onClick={() => handleViewPedido(order)}
          size="sm"
          variant="outline"
        >
          Detalhes
        </Button>
      </div>
      <OrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        order={selectedPedido}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
