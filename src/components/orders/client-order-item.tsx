import React, { useCallback } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { updateOrderStatus } from "@/requests/order";
import { useCartContext } from "@/contexts/cart-context";
import { useRouter } from "next/navigation";

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
  const { push } = useRouter();
  const isExpanded = expandedOrders[order.id] || false;
  const { mutateAsync: confirmMutation } = useMutation({
    mutationKey: ["cancel", "order"],
    mutationFn: async () => await updateOrderStatus(order.id, "CANCELED"),
  });
  const { handleAddManyCartItems } = useCartContext();

  const repeatOrder = useCallback(() => {
    handleAddManyCartItems(
      order.products.map((product) => ({
        id: product.id,
        price: product.price,
        product: product.product,
        observation: product.observation || undefined,
        productId: product.id,
        quantity: product.quantity,
        unitPrice: product.price,
        variants: product.variants.map((pv) => ({
          variantId: pv.id,
          variantName: pv.variantName,
          variantPrice: pv.variantPrice,
        })),
      }))
    );
    push("/cart");
  }, [order, handleAddManyCartItems, push]);

  const address: IAddress = order?.addressSnapshot
    ? order?.addressSnapshot[0] === "{"
      ? JSON.parse(order?.addressSnapshot || "{}")
      : null
    : null;

  return (
    <Card key={order.id}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-lg">
              Pedido #{order.id.split("-")[0]}
            </CardTitle>
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
          <div className="flex flex-col items-end">
            <Badge className={`${statusInfo.color} flex items-center gap-1`}>
              <statusInfo.icon className="h-3.5 w-3.5" />
              {statusInfo.label}
            </Badge>
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
            <p>
              {
                {
                  money: "Dinheiro",
                  cash: "Dinheiro",
                  card: "Cartão",
                  pix: "Pix",
                }[order.paymentMethod.toLowerCase()]
              }
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Endereço</p>
            {order.isWithdrawal ? (
              <span>Retirada no local</span>
            ) : (
              <p>{address?.name}</p>
            )}
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
        <div className="flex justify-center md:justify-start mt-2">
          {order.status === "PENDING" && (
            <AlertDialog>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar pedido</AlertDialogTitle>
                </AlertDialogHeader>
                <div>
                  Tem certeza que deseja cancelar o pedido? Essa ação não pode
                  ser desfeita
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <Button type="button" variant="destructive" asChild>
                    <AlertDialogAction onClick={() => confirmMutation()}>
                      Confirmar
                    </AlertDialogAction>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-fit">
                  Cancelar Pedido
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>
          )}
          {order.status === "COMPLETED" && (
            <Button
              type="button"
              onClick={repeatOrder}
              className="w-full md:w-fit"
            >
              Refazer pedido
            </Button>
          )}
        </div>

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
                    <div>
                      {orderProduct.observation && (
                        <p className="text-sm text-muted-foreground">
                          Observação: {orderProduct.observation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.observation && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Observação: </h4>
                  <p>{order.observation}</p>
                </div>
              </>
            )}
            <Separator />

            <div>
              <h4 className="font-medium mb-2">Endereço de Entrega</h4>
              {order.isWithdrawal ? (
                <span>Retirada no local</span>
              ) : (
                <>
                  <p>{address?.address}</p>
                  <p>
                    {address?.district}, {address?.city}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
