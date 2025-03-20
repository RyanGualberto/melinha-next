import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingBag,
  Tag,
  Layers,
  Truck,
  ChefHat,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Dados de exemplo para pedidos
const pedidosAguardando = [
  {
    id: "1",
    cliente: "João Silva",
    valor: 35.9,
    horario: "10:15",
    items: ["Açaí Tradicional (M)", "Açaí com Banana (P)"],
  },
  {
    id: "2",
    cliente: "Maria Oliveira",
    valor: 28.5,
    horario: "10:30",
    items: ["Açaí com Morango (G)"],
  },
  {
    id: "3",
    cliente: "Pedro Santos",
    valor: 42.75,
    horario: "10:45",
    items: ["Açaí Tradicional (G)", "Açaí Especial (P)"],
  },
];

const pedidosPreparo = [
  {
    id: "4",
    cliente: "Ana Souza",
    valor: 32.4,
    horario: "10:05",
    items: ["Açaí Premium (M)", "Açaí com Banana (P)"],
  },
  {
    id: "5",
    cliente: "Carlos Ferreira",
    valor: 45.8,
    horario: "10:10",
    items: ["Açaí Especial (G)", "Açaí com Morango (M)"],
  },
];

const pedidosEntrega = [
  {
    id: "6",
    cliente: "Fernanda Lima",
    valor: 38.9,
    horario: "09:50",
    items: ["Açaí Tradicional (G)", "Açaí com Banana (M)"],
  },
  {
    id: "7",
    cliente: "Roberto Alves",
    valor: 25.5,
    horario: "09:55",
    items: ["Açaí Premium (P)"],
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de gerenciamento da Melinha Açaíteria
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhum pedido registrado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhum produto cadastrado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Categorias
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma categoria cadastrada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Variantes
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma variante cadastrada
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Pedidos Ativos
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Pedidos Aguardando Confirmação */}
          <Card>
            <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  Aguardando Confirmação
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                >
                  {pedidosAguardando.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {pedidosAguardando.map((pedido) => (
                  <div key={pedido.id} className="p-4 hover:bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Pedido #{pedido.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {pedido.horario}
                      </div>
                    </div>
                    <div className="text-sm mb-1">{pedido.cliente}</div>
                    <div className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {pedido.items.join(", ")}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(pedido.valor)}
                      </div>
                      <Button size="sm" variant="outline">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
                {pedidosAguardando.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum pedido aguardando confirmação
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pedidos Em Preparo */}
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ChefHat className="h-5 w-5 mr-2 text-blue-500" />
                  Em Preparo
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                >
                  {pedidosPreparo.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {pedidosPreparo.map((pedido) => (
                  <div key={pedido.id} className="p-4 hover:bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Pedido #{pedido.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {pedido.horario}
                      </div>
                    </div>
                    <div className="text-sm mb-1">{pedido.cliente}</div>
                    <div className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {pedido.items.join(", ")}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(pedido.valor)}
                      </div>
                      <Button size="sm" variant="outline">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
                {pedidosPreparo.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum pedido em preparo
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pedidos Saiu para Entrega */}
          <Card>
            <CardHeader className="bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-green-500" />
                  Saiu para Entrega
                </CardTitle>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                >
                  {pedidosEntrega.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {pedidosEntrega.map((pedido) => (
                  <div key={pedido.id} className="p-4 hover:bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Pedido #{pedido.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {pedido.horario}
                      </div>
                    </div>
                    <div className="text-sm mb-1">{pedido.cliente}</div>
                    <div className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {pedido.items.join(", ")}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(pedido.valor)}
                      </div>
                      <Button size="sm" variant="outline">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
                {pedidosEntrega.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhum pedido em entrega
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 text-center">
          <Button asChild variant="outline">
            <Link href="/pedidos">Ver todos os pedidos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
