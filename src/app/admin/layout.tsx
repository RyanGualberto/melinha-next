"use client";
import type React from "react";
import { SidebarNav } from "@/components/shared/admin-sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebarMobileTrigger from "@/components/shared/admin-sidebar-mobile-trigger";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { listOrders } from "@/requests/order";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [oldOrdersLength, setOldOrdersLength] = useState<number | null>(null);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const orders = await listOrders();
      return orders;
    },
  });

  useEffect(() => {
    if (oldOrdersLength === null) {
      setOldOrdersLength(orders?.length || null);
    }
  }, [orders, oldOrdersLength]);

  function playTrimmedAudio() {
    const audio = new Audio("/sounds/notification.wav");
    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 3000);
  }

  useEffect(() => {
    const handleNewOrder = () => {
      setHasNewOrder(true);
      playTrimmedAudio();
      setOldOrdersLength(orders?.length || null);
    };

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      console.log("invalidating");
    }, 5000);

    if (
      orders &&
      orders.length > 0 &&
      oldOrdersLength !== null &&
      orders.length > oldOrdersLength
    ) {
      handleNewOrder();
    }

    return () => clearInterval(interval);
  }, [queryClient, orders, oldOrdersLength]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col w-screen">
        <div className="flex flex-1">
          <AdminSidebarMobileTrigger />
          <SidebarNav />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
      <AlertDialog open={hasNewOrder} onOpenChange={setHasNewOrder}>
        <AlertDialogContent className="flex flex-col">
          <AlertDialogTitle>
            <AlertTitle>Novo pedido</AlertTitle>
          </AlertDialogTitle>
          <AlertDescription>
            <p>
              Um novo pedido foi criado. Clique no botão abaixo para ver os
              detalhes.
            </p>
          </AlertDescription>
          <AlertDialogAction
            onClick={() => {
              setHasNewOrder(false);
              push("/admin/orders");
              queryClient.invalidateQueries({ queryKey: ["orders"] });
            }}
          >
            Ver Pedido
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
