"use client";

import { useState } from "react";
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
} from "lucide-react";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: any;
  onUpdateStatus: (orderId: string, novoStatus: string) => Promise<void>;
}

export function OrderDialog({
  open,
  onOpenChange,
  order,
  onUpdateStatus,
}: OrderDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  if (!order) return null;

  const handleStatusChange = async (novoStatus: string) => {
    if (novoStatus === order.status) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, novoStatus);
      setCurrentStatus(novoStatus);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aguardando":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            Aguardando confirmação
          </Badge>
        );
      case "em_preparo":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Em preparo
          </Badge>
        );
      case "em_entrega":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Em entrega
          </Badge>
        );
      case "entregue":
        return (
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            Entregue
          </Badge>
        );
      case "cancelado":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            Cancelado
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getMetodoPagamento = (metodo: string) => {
    switch (metodo) {
      case "dinheiro":
        return "Dinheiro";
      case "cartao":
        return "Cartão";
      case "pix":
        return "PIX";
      default:
        return "Desconhecido";
    }
  };

  const calcularSubtotal = () => {
    return order.items.reduce(
      (total: number, item: any) => total + item.preco * item.quantidade,
      0
    );
  };

  const calcularTaxaEntrega = () => {
    return 5.0; // Valor fixo para exemplo
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>order #{order.id}</span>
            {getStatusBadge(currentStatus || order.status)}
          </DialogTitle>
          <DialogDescription>
            {new Date(order.data).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="detalhes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            <TabsTrigger value="cliente">Cliente</TabsTrigger>
            <TabsTrigger value="entrega">Entrega</TabsTrigger>
          </TabsList>

          <TabsContent value="detalhes" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Itens do order
              </h3>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between p-4">
                        <div>
                          <span className="font-medium">
                            {item.quantidade}x
                          </span>{" "}
                          {item.nome}
                        </div>
                        <div className="font-medium">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.preco * item.quantidade)}
                        </div>
                      </div>
                    ))}
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
                      }).format(calcularSubtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de entrega</span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(calcularTaxaEntrega())}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(order.valor)}
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
                    <span>
                      Método: {getMetodoPagamento(order.pagamento.metodo)}
                    </span>
                  </div>
                  {order.pagamento.metodo === "dinheiro" &&
                    order.pagamento.troco && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">
                          Troco para:{" "}
                        </span>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(order.pagamento.troco))}
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>

            {order.observacoes && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Observações
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{order.observacoes}</span>
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
                  <span className="font-medium">{order.cliente.nome}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{order.cliente.telefone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{order.cliente.email}</span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="outline" size="sm">
                Ver histórico de orders
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="entrega" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p>{order.endereco.rua}</p>
                    <p>
                      {order.endereco.bairro}, {order.endereco.cidade} -{" "}
                      {order.endereco.estado}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="outline" size="sm">
                Ver no mapa
              </Button>
            </div>
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
                <SelectItem value="aguardando" className="flex items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-amber-500" />
                    Aguardando confirmação
                  </div>
                </SelectItem>
                <SelectItem value="em_preparo">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-blue-500" />
                    Em preparo
                  </div>
                </SelectItem>
                <SelectItem value="em_entrega">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-green-500" />
                    Em entrega
                  </div>
                </SelectItem>
                <SelectItem value="entregue">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />
                    Entregue
                  </div>
                </SelectItem>
                <SelectItem value="cancelado">
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
