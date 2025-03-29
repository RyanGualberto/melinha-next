"use client";

import Link from "next/link";
import { User, MapPin, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/contexts/user-context";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserOrders } from "@/requests/order";

export default function MinhaContaPage() {
  const { currentUser, addresses } = useAuthContext();
  const { data: orders } = useQuery({
    queryKey: ["user", "orders"],
    queryFn: async () => await getCurrentUserOrders(),
  });
  const { logout } = useAuthContext();
  return (
    <div className="container px-4 sm:px-0 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Minha Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e acompanhe seus pedidos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Nome:</span>
                <p>
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email:</span>
                <p>{currentUser?.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Telefone:</span>
                <p>{currentUser?.phoneNumber}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Data de Cadastro:
                </span>
                <p>
                  {new Date(currentUser?.createdAt || "").toLocaleString(
                    "pt-BR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/minha-conta/editar">Editar Informações</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Endereços
            </CardTitle>
            <CardDescription>
              Gerencie seus endereços de entrega
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {addresses.length === 0
                ? "Você não tem nenhum endereço cadastrado"
                : `Você tem ${addresses.length} endereço${
                    addresses.length !== 1 ? "s" : ""
                  } cadastrado${addresses.length !== 1 ? "s" : ""}.`}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/profile/addresses">Gerenciar Endereços</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Histórico de Pedidos
            </CardTitle>
            <CardDescription>Acompanhe seus pedidos anteriores</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {orders?.length === 0
                ? "Você não fez nenhum pedido em Melinha Açaíteria"
                : `Você fez ${orders?.length} pedido${
                    orders?.length !== 1 ? "s" : ""
                  } em Melinha Açaíteria`}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/profile/orders">Ver Histórico</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="flex justify-center">
        <Button
          onClick={logout}
          variant="destructive"
          className="flex items-center"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}
