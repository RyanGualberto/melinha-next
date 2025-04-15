"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getDashboard } from "@/requests/dashboard";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw, ShoppingBag } from "lucide-react";

export default function Dashboard() {
  const {
    data: dashboardData,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => await getDashboard(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao sistema de gerenciamento da Melinha Açaíteria
          </p>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            className="hidden md:inline-flex"
          >
            <RefreshCcw
              className={cn("h-4 w-4", {
                "animate-spin": isPending,
              })}
            />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quantidade de clientes
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.totalClients}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dashboardData?.averageTicket || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos no último mês
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.ordersLast30Days}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos no último final de semana
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.ordersLastWeekend}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturado no último mês
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dashboardData?.revenueLast30Days || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturado no último final de semana
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dashboardData?.revenueLastWeekend || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Item mais vendido no último mês
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.bestSellingItemLast30Days?.productTitleSnapshot}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.bestSellingItemLast30Days?._sum.quantity} venda
              {dashboardData?.bestSellingItemLastWeekend?._sum.quantity === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Item mais vendido no último fim de semana
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.bestSellingItemLastWeekend?.productTitleSnapshot}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.bestSellingItemLastWeekend?._sum.quantity} venda
              {dashboardData?.bestSellingItemLastWeekend?._sum.quantity === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Item menos vendido no último mês
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.leastSellingItemLast30Days?.productTitleSnapshot}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.leastSellingItemLast30Days?._sum.quantity} venda
              {dashboardData?.leastSellingItemLast30Days?._sum.quantity === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Item menos vendido no último fim de semana
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.leastSellingItemLastWeekend?.productTitleSnapshot}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.leastSellingItemLastWeekend?._sum.quantity} venda
              {dashboardData?.leastSellingItemLastWeekend?._sum.quantity === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bairro mais vendido no último mês
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.bestSellingNeighborhoodLast30Days[0]}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.bestSellingNeighborhoodLast30Days[1]} venda
              {dashboardData?.bestSellingNeighborhoodLast30Days[1] === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bairro menos vendido no último mês
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.leastSellingNeighborhoodLast30Days[0]}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.leastSellingNeighborhoodLast30Days[1]} venda
              {dashboardData?.leastSellingNeighborhoodLast30Days[1] === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bairro mais vendido no último final de semana
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.bestWorstSellingNeighborhoodLastWeekend[0]}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.bestWorstSellingNeighborhoodLastWeekend[1]} venda
              {dashboardData?.bestWorstSellingNeighborhoodLastWeekend[1] === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bairro menos vendido no último final de semana
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.leastSellingNeighborhoodLastWeekend[0]}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.leastSellingNeighborhoodLastWeekend[1]} venda
              {dashboardData?.leastSellingNeighborhoodLastWeekend[1] === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
