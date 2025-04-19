"use client";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import { IOrder } from "@/types/order";
import { OrderStatus } from "@/types/order-status";
import { IUser } from "@/types/user";
import { IAddress } from "@/types/address";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@/requests/order";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: IOrder;
}

export function OrderDialog({ open, onOpenChange, order }: OrderDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: updateOrderMutation, isPending: isUpdating } =
    useMutation({
      mutationKey: ["updateOrderStatus", order.id],
      mutationFn: (newStatus: keyof typeof OrderStatus) =>
        updateOrderStatus(order.id, newStatus),
    });
  const [currentStatus, setCurrentStatus] = useState<
    keyof typeof OrderStatus | null
  >(null);
  const user: IUser = JSON.parse(order.userSnapshot || "");
  const address: IAddress = JSON.parse(order?.addressSnapshot || "{}");
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const paymentInfo =
      order.paymentMethod === "money"
        ? `Dinheiro - ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(order.total)}`
        : order.paymentMethod === "card"
        ? `Cartão - ${new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(order.total)}`
        : `PIX - pago`;
    navigator.clipboard.writeText(
      `${user.firstName} ${user.lastName} - ${paymentInfo} \n \n ${address.address}, ${address.number} - ${address.complement}, ${address.reference} - ${address.district}, ${address.city} - ${address.state}, ${address.zipCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [address, order, user]);

  const handleStatusChange = async (newStatus: keyof typeof OrderStatus) => {
    if (newStatus === order.status) return;

    try {
      await updateOrderMutation(newStatus);
      setCurrentStatus(newStatus);
      if (newStatus === "CANCELED" || newStatus === "COMPLETED") {
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["orders", "in", "progress"],
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
    }
  };

  const getStatusBadge = (status: keyof typeof OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            Aguardando confirmação
          </Badge>
        );
      case OrderStatus.IN_PROGRESS:
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Em preparo
          </Badge>
        );
      case OrderStatus.DELIVERY_IN_PROGRESS:
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Em entrega
          </Badge>
        );
      case OrderStatus.COMPLETED:
        return (
          <Badge className="bg-purple-100 text-[#73067D]/80 dark:bg-purple-900 dark:text-purple-300">
            Entregue
          </Badge>
        );
      case OrderStatus.CANCELED:
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            Cancelado
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getOrderPayment = (metodo: string) => {
    switch (metodo) {
      case "money":
        return "Dinheiro";
      case "card":
        return "Cartão";
      case "pix":
        return "PIX";
      default:
        return "Desconhecido";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pedido #{order.id}</span>
          </DialogTitle>
          <div className="flex items-center justify-between">
            <div>
              <DialogDescription>
                {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </DialogDescription>
              {[
                OrderStatus.DELIVERY_IN_PROGRESS,
                OrderStatus.IN_PROGRESS,
              ].includes(order.status) && (
                <span className="text-muted-foreground text-sm">
                  Entrega prevista para{" "}
                  {new Date(
                    new Date(order.createdAt).getTime() +
                      order.deliveryTime * 60000
                  ).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
            {getStatusBadge(currentStatus || order.status)}
          </div>
        </DialogHeader>
        <div className="flex items-center justify-between">
          {[OrderStatus.PENDING, OrderStatus.IN_PROGRESS].includes(
            order.status
          ) && (
            <Button
              onClick={() => handleStatusChange("CANCELED")}
              disabled={isUpdating}
              variant="destructive"
            >
              Cancelar Pedido
            </Button>
          )}
          {order.status === OrderStatus.PENDING && (
            <Button
              onClick={() => handleStatusChange("IN_PROGRESS")}
              variant="secondary"
              disabled={isUpdating}
              className="bg-yellow-50 border border-yellow-600 text-yellow-600"
            >
              Confirmar Pedido
            </Button>
          )}
          {order.status === OrderStatus.IN_PROGRESS && (
            <Button
              onClick={() => handleStatusChange("DELIVERY_IN_PROGRESS")}
              variant="secondary"
              disabled={isUpdating}
              className="bg-blue-50 border border-blue-600 text-blue-600"
            >
              Iniciar Entrega
            </Button>
          )}
          {order.status === OrderStatus.DELIVERY_IN_PROGRESS && (
            <Button
              onClick={() => handleStatusChange("COMPLETED")}
              variant="secondary"
              disabled={isUpdating}
              className="bg-green-50 border border-green-600 text-green-600"
            >
              Finalizar Entrega
            </Button>
          )}
        </div>
        <Tabs defaultValue="detalhes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="cliente">Cliente</TabsTrigger>
            <TabsTrigger value="entrega">Entrega</TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Itens do Pedido
              </h3>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {order.products.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between p-4">
                          <div>
                            <span className="font-medium">
                              {item.quantity}x
                            </span>{" "}
                            {item.productTitleSnapshot}
                          </div>
                          <div className="font-medium">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.productPriceSnapshot)}
                          </div>
                        </div>
                        <ul className="flex flex-col">
                          {item.variants.map((variant, index) => (
                            <li
                              key={index}
                              className="flex justify-between p-4"
                            >
                              <div className="text-sm text-muted-foreground">
                                {variant.variantName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(variant.variantPrice)}
                              </div>
                            </li>
                          ))}
                        </ul>
                        {item.observation && (
                          <div className="flex justify-between p-4">
                            <div className="text-sm text-muted-foreground">
                              Observação:{" "}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.observation}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {order.observation && (
                      <div className="flex justify-between p-4">
                        <div className="text-sm text-muted-foreground">
                          Observação:{" "}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.observation}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Resumo
              </h3>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.total - order.deliveryCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega</span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.deliveryCost)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.total)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Pagamento
              </h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Método: {getOrderPayment(order.paymentMethod)}</span>
                  </div>
                  {order.paymentMethod === "money" && order.paymentChange && (
                    <div className="mt-2 text-sm">
                      <span className="text-muted-foreground">
                        Troco para:{" "}
                      </span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(order.paymentChange))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {order.observation && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Observações
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{order.observation}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cliente" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.phoneNumber}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entrega" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="justify-between flex">
                <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
                <Button size="icon" variant="outline" onClick={handleCopy}>
                  {copied ? <Check /> : <Copy />}
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="min-h-4 min-w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    {order.isWithdrawal ? (
                      <p>Retirada no local</p>
                    ) : (
                      <p>
                        {`${address.address}, ${address.number} - ${address.complement}, ${address.reference} - ${address.district}, ${address.city} - ${address.state}, ${address.zipCode}`}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Atualizar Status</h3>
          <div className="flex items-center gap-2">
            <Select
              value={currentStatus || order.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={OrderStatus.PENDING}
                  className="flex items-center"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    Aguardando confirmação
                  </div>
                </SelectItem>
                <SelectItem value={OrderStatus.IN_PROGRESS}>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-blue-500" />
                    Em preparo
                  </div>
                </SelectItem>
                <SelectItem value={OrderStatus.DELIVERY_IN_PROGRESS}>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-green-500" />
                    Em entrega
                  </div>
                </SelectItem>
                <SelectItem value={OrderStatus.COMPLETED}>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />
                    Entregue
                  </div>
                </SelectItem>
                <SelectItem value={OrderStatus.CANCELED}>
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Cancelado
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
