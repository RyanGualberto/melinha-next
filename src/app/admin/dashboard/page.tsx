"use client";
import OrdersResume from "@/components/orders/orders-resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listCategories } from "@/requests/category";
import { listProducts } from "@/requests/product";
import { listProductVariants } from "@/requests/product-variant";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingBag, Tag, Layers } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await listProducts(),
  });

  const { data: productVariants } = useQuery({
    queryKey: ["variants"],
    queryFn: async () => await listProductVariants(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await listCategories(),
  });

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
            <div className="text-2xl font-bold">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {products?.length === 0 ? (
                <Link href="/admin/products">
                  <Button variant="link" className="p-0">
                    Cadastrar um produto
                  </Button>
                </Link>
              ) : null}
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
            <div className="text-2xl font-bold">{categories?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {categories?.length === 0 ? (
                <Link href="/admin/categories">
                  <Button variant="link" className="p-0">
                    Cadastrar uma categoria
                  </Button>
                </Link>
              ) : null}
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
            <div className="text-2xl font-bold">
              {productVariants?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {productVariants?.length === 0 ? (
                <Link href="/admin/variants">
                  <Button variant="link" className="p-0">
                    Cadastrar uma variante
                  </Button>
                </Link>
              ) : null}
            </p>
          </CardContent>
        </Card>
      </div>
      <OrdersResume />
    </div>
  );
}
