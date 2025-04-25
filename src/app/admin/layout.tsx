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
import { listNewOrders } from "@/requests/order";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const { data: orders } = useQuery({
    queryKey: ["new", "orders"],
    queryFn: async () => {
      const orders = await listNewOrders();
      return orders;
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    };

    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["new", "orders"] });
    }, 10000);

    if (orders?.length) {
      handleNewOrder();
    }

    return () => clearInterval(interval);
  }, [queryClient, orders]);

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
