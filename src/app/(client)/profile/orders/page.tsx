"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Truck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Dados de exemplo
const pedidos = [
  {
    id: "1",
    data: new Date(2023, 2, 15, 19, 30),
    status: "entregue",
    total: 42.5,
    items: [
      { id: "1", nome: "Açaí Tradicional (M)", quantidade: 1, preco: 19.99 },
      { id: "2", nome: "Açaí com Banana (P)", quantidade: 1, preco: 17.5 },
    ],
    endereco: {
      nome: "Casa",
      rua: "Rua das Flores, 123",
      bairro: "Centro",
      cidade: "São Paulo",
    },
    pagamento: "Cartão de Crédito",
  },
  {
    id: "2",
    data: new Date(2023, 2, 10, 20, 15),
    status: "entregue",
    total: 24.99,
    items: [{ id: "3", nome: "Açaí Premium (G)", quantidade: 1, preco: 24.99 }],
    endereco: {
      nome: "Trabalho",
      rua: "Av. Paulista, 1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
    },
    pagamento: "Dinheiro",
  },
  {
    id: "3",
    data: new Date(),
    status: "em_preparo",
    total: 38.9,
    items: [
      { id: "4", nome: "Açaí com Morango (M)", quantidade: 2, preco: 19.45 },
    ],
    endereco: {
      nome: "Casa",
      rua: "Rua das Flores, 123",
      bairro: "Centro",
      cidade: "São Paulo",
    },
    pagamento: "PIX",
  },
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case "aguardando":
      return {
        label: "Aguardando Confirmação",
        color:
          "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
        icon: Clock,
      };
    case "em_preparo":
      return {
        label: "Em Preparo",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        icon: Package,
      };
    case "em_entrega":
      return {
        label: "Saiu para Entrega",
        color:
          "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
        icon: Truck,
      };
    case "entregue":
      return {
        label: "Entregue",
        color:
          "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
        icon: CheckCircle2,
      };
    default:
      return {
        label: "Desconhecido",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        icon: Clock,
      };
  }
};

export default function PedidosPage() {
  const [expandedPedidos, setExpandedPedidos] = useState<
    Record<string, boolean>
  >({});

  const togglePedido = (id: string) => {
    setExpandedPedidos({
      ...expandedPedidos,
      [id]: !expandedPedidos[id],
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Meus Pedidos</h1>
        <p className="text-muted-foreground">
          Acompanhe o histórico e status dos seus pedidos
        </p>
      </div>

      <div className="space-y-6">
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => {
            const statusInfo = getStatusInfo(pedido.status);
            const isExpanded = expandedPedidos[pedido.id] || false;

            return (
              <Card key={pedido.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        Pedido #{pedido.id}
                      </CardTitle>
                      <CardDescription>
                        {new Date(pedido.data).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${statusInfo.color} flex items-center gap-1`}
                    >
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
                        }).format(pedido.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Forma de Pagamento</p>
                      <p>{pedido.pagamento}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Endereço</p>
                      <p>{pedido.endereco.nome}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center"
                    onClick={() => togglePedido(pedido.id)}
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
                          {pedido.items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                              <span>
                                {item.quantidade}x {item.nome}
                              </span>
                              <span>
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(item.preco * item.quantidade)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-2">
                          Endereço de Entrega
                        </h4>
                        <p>{pedido.endereco.rua}</p>
                        <p>
                          {pedido.endereco.bairro}, {pedido.endereco.cidade}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              Você ainda não fez nenhum pedido
            </h2>
            <p className="text-muted-foreground mb-6">
              Que tal experimentar nossos deliciosos açaís?
            </p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/">Ver Cardápio</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
