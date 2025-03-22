"use client";
import type React from "react";
import { SidebarNav } from "@/components/shared/admin-sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebarMobileTrigger from "@/components/shared/admin-sidebar-mobile-trigger";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { socket } from "@/config/socket-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [hasNewOrder, setHasNewOrder] = useState(false);

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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      playTrimmedAudio();
    };

    socket.on("orderCreated", handleNewOrder);

    return () => {
      socket.off("orderCreated", handleNewOrder);
    };
  }, [queryClient]);

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
          <AlertDialogCancel>Ver Pedido</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
