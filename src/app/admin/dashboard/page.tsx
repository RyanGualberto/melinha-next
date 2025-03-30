"use client";
import OrdersResume from "@/components/orders/orders-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listOrders } from "@/requests/order";
import { listProducts } from "@/requests/product";
import { listUsers } from "@/requests/user";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Tag, Layers } from "lucide-react";
import { useMemo } from "react";

export default function Dashboard() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await listProducts(),
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await listOrders(),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await listUsers(),
  });

  const dashboardData = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const startDate = new Date(now);
    if (currentHour < 2) {
      startDate.setDate(startDate.getDate() - 1);
    }
    startDate.setHours(16, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(2, 0, 0, 0);

    const ordersInPeriod = orders?.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate < endDate;
    });

    console.log(ordersInPeriod);

    const ordersLengthToday =
      ordersInPeriod?.length === undefined ? 0 : ordersInPeriod?.length;

    const ordersPriceTotalToday =
      ordersInPeriod?.reduce((acc, order) => acc + order.total, 0) || 0;

    const ordersCostTotal = ordersInPeriod?.reduce(
      (acc, order) => acc + order.deliveryCost,
      0
    );

    const usersNotAdmin = users?.filter((user) => user.role !== "admin") || [];

    const productsLength =
      products?.length === undefined ? 0 : products?.length;

    return {
      ordersLength: ordersLengthToday,
      ordersPriceTotal: ordersPriceTotalToday,
      usersLength: usersNotAdmin?.length || 0,
      productsLength: productsLength,
      ordersCostTotal: ordersCostTotal || 0,
    };
  }, [products, orders, users]);

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
              Quantidade de clientes
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.usersLength}
            </div>
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
            <div className="text-2xl font-bold">
              {dashboardData.productsLength}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.ordersLength}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturado hoje</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dashboardData.ordersPriceTotal)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frete hoje</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(dashboardData.ordersCostTotal)}
            </div>
          </CardContent>
        </Card>
      </div>
      <OrdersResume />
    </div>
  );
}
