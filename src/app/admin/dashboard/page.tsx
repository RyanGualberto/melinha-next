"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithPresets } from "@/components/ui/date-picker-with-presets";
import { cn } from "@/lib/utils";
import { getDashboard } from "@/requests/dashboard";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

export default function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const {
    data: dashboardData,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () =>
      await getDashboard({
        from: date?.from ? date.from.toISOString() : undefined,
        to: date?.to ? date.to.toISOString() : undefined,
      }),
  });

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao sistema de gerenciamento da Melinha Açaíteria
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DatePickerWithPresets date={date} setDate={setDate} />
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
              Pedidos no Periodo
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.ordersPeriod}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Item mais vendido no Período
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.bestSellingItemPeriod?.productTitleSnapshot}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.bestSellingItemPeriod?._sum.quantity} venda
              {dashboardData?.bestSellingItemPeriod?._sum.quantity === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Item menos vendido no Período
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.leastSellingItemPeriod?.productTitleSnapshot}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.leastSellingItemPeriod?._sum.quantity} venda
              {dashboardData?.leastSellingItemPeriod?._sum.quantity === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bairro mais vendido no Período
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.bestSellingNeighborhoodPeriod[0]}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.bestSellingNeighborhoodPeriod[1]} venda
              {dashboardData?.bestSellingNeighborhoodPeriod[1] === 1 ? "" : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bairro menos vendido no Período
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.leastSellingNeighborhoodPeriod[0]}
            </div>
            <div className="text-sm justify-end flex">
              {dashboardData?.leastSellingNeighborhoodPeriod[1]} venda
              {dashboardData?.leastSellingNeighborhoodPeriod[1] === 1
                ? ""
                : "s"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dias trabalhados
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              {dashboardData?.totalWorkedDays || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturado no Período
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
              }).format(dashboardData?.revenuePeriod || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Taxa Fixa Motoboy
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
              }).format(dashboardData?.deliveryFixedTotalCost || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Frete
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
              }).format(dashboardData?.totalDeliveryCost || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa Fixa + Frete
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
              }).format(
                dashboardData?.totalDeliveryCostMoreDeliveryFixedTotalCost || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Custo de produtos
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              ~{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dashboardData?.totalCost || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lucro Presumido
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent
            className={cn({
              "animate-pulse": isPending,
            })}
          >
            <div className="text-2xl font-bold">
              ~{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dashboardData?.realProfit || 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
