"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserOrders } from "@/requests/order";
import { CientOrderItem } from "@/components/orders/client-order-item";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Pusher from "pusher-js";
import { useAuthContext } from "@/contexts/user-context";

export default function PedidosPage() {
  const { currentUser } = useAuthContext();
  const { data: orders, refetch: refetchOrders } = useQuery({
    queryKey: ["user", "orders"],
    queryFn: getCurrentUserOrders,
  });

  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {}
  );

  const toggleOrder = (id: string) => {
    setExpandedOrders({
      ...expandedOrders,
      [id]: !expandedOrders[id],
    });
  };

  useEffect(() => {
    const pusher = new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_KEY), {
      cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
    });

    const channel = pusher.subscribe(`orders_user_${currentUser?.id}`);
    channel.bind("orderUpdated", () => {
      refetchOrders();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [refetchOrders, currentUser?.id]);

  return (
    <div className="container py-8 px-4 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Meus Pedidos</h1>
        <p className="text-muted-foreground">
          Acompanhe o histórico e status dos seus pedidos
        </p>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-lg p-6 mb-8 border border-purple-200 dark:border-purple-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center">
              <span className="inline-block h-3 w-3 rounded-full bg-purple-600 mr-2"></span>
              Programa de Fidelidade
            </h2>
            <p className="text-sm text-muted-foreground">
              A cada 12 pedidos, você ganha um açaí clássico grátis!
            </p>
          </div>

          {orders &&
          orders.filter((ord) => ord.status !== "CANCELED").length >= 12 ? (
            <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Você tem um açaí grátis disponível!
            </div>
          ) : (
            <div className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
              Faltam{" "}
              {12 -
                (orders?.filter((ord) => ord.status !== "CANCELED")?.length ||
                  0)}{" "}
              pedidos para ganhar
            </div>
          )}
        </div>

        <div className="relative">
          <Progress
            value={
              orders
                ? (orders.filter((ord) => ord.status !== "CANCELED").length %
                    12) *
                  (100 / 12)
                : 0
            }
            className="h-4 bg-purple-200 dark:bg-purple-950"
          />

          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-1 h-1 rounded-full ${
                    (orders?.length || 0) % 12 >= (i + 1) * 3
                      ? "bg-purple-600"
                      : "bg-purple-200 dark:bg-purple-800"
                  }`}
                ></div>
                <span>{(i + 1) * 3}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm">
              <span className="font-medium">
                {orders ? orders.length % 12 : 0}
              </span>
              <span className="text-muted-foreground"> de 12 pedidos</span>
            </div>

            <div className="flex -space-x-2">
              {[
                ...Array(
                  Math.min(5, orders ? Math.floor(orders.length / 3) : 0)
                ),
              ].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>

        {orders && orders.length > 0 && (
          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">
              Total de pedidos realizados:{" "}
              <span className="font-medium text-foreground">
                {orders.length}
              </span>
              {orders.length >= 12 && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  ({Math.floor(orders.length / 12)} açaí(s) grátis já
                  conquistado(s)!)
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {(orders || []).length > 0 ? (
          (orders || []).map((order) => (
            <CientOrderItem
              key={order.id}
              order={order}
              toggleOrder={toggleOrder}
              expandedOrders={expandedOrders}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">
              Você ainda não fez nenhum pedido
            </h2>
            <p className="text-muted-foreground mb-6">
              Que tal experimentar nossos deliciosos açaís?
            </p>
            <Button asChild className="bg-[#73067D] hover:bg-[#73067D]/80">
              <Link href="/">Ver Cardápio</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
