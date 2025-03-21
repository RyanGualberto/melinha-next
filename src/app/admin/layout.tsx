"use client";
import type React from "react";
import { SidebarNav } from "@/components/shared/admin-sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebarMobileTrigger from "@/components/shared/admin-sidebar-mobile-trigger";
import { io } from "socket.io-client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const socket = io(process.env.NEXT_PUBLIC_API_URL); // Ajuste a URL conforme necessário

  socket.on("orderCreated", (order) => {
    setHasNewOrder(order);
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  });

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
          <AlertDialogAction>
            <a href="/admin/orders">Ver pedido</a>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
