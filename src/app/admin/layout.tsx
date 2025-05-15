"use client";
import type React from "react";
import { SidebarNav } from "@/components/shared/admin-sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebarMobileTrigger from "@/components/shared/admin-sidebar-mobile-trigger";
import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pusher from "pusher-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IOrder } from "@/types/order";
import InstallButton from "@/components/pwa/install-button";
import { requestPermissionAndSendToken } from "@/lib/notification";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrimmedAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/notification.wav");
    }

    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 3000);
  }, []);

  const handleBrowserNotification = useCallback(
    (order: IOrder) => {
      if (!("Notification" in window)) {
        toast.error("Seu navegador não suporta notificações!");
        return;
      }

      if (Notification.permission === "granted") {
        const notification = new Notification("Novo pedido recebido!", {
          body: `Pedido #${JSON.parse(order.userSnapshot).firstName} - ${
            order.products.length
          } itens`,
        });

        notification.onclick = () => {
          window.focus();
          queryClient.invalidateQueries({ queryKey: ["orders"] });
          queryClient.invalidateQueries({
            queryKey: ["orders", "in", "progress"],
          });
        };
      }
    },
    [queryClient]
  );

  const handleReceiveOrder = useCallback(
    (order: IOrder) => {
      toast.custom(
        () => (
          <div
            className={`pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-lg border border-border flex gap-2 items-center p-4`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-900">
                Novo pedido recebido!
              </span>
              <span className="text-sm text-gray-500">
                Pedido #{JSON.parse(order.userSnapshot).firstName}
              </span>
              <span className="text-sm text-gray-500">
                {order.products.length} itens
              </span>
              <span className="text-sm text-gray-500">
                {order.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
                -{" "}
                {new Date(order.createdAt).toLocaleString("pt-BR", {
                  timeStyle: "short",
                })}
              </span>
              <span className="text-sm text-gray-500"></span>
            </div>
            <Link href="/admin/orders">
              <Button>Ver pedidos</Button>
            </Link>
          </div>
        ),
        {
          position: "top-right",
          duration: 15000,
        }
      );
      playTrimmedAudio();
      // handleBrowserNotification(order);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "in", "progress"] });
    },
    [playTrimmedAudio, queryClient, handleBrowserNotification]
  );

  useEffect(() => {
    requestPermissionAndSendToken();
  }, []);

  useEffect(() => {
    const pusher = new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_KEY), {
      cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
    });

    const channel = pusher.subscribe("orders");
    channel.bind("orderCreated", (order: IOrder) => {
      handleReceiveOrder(order);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [handleReceiveOrder]);

  return (
    <SidebarProvider>
      <InstallButton />
      <div className="flex min-h-screen flex-col w-screen">
        <div className="flex flex-1">
          <AdminSidebarMobileTrigger />
          <SidebarNav />
          <main className="flex-1 p-6 md:p-8 max-w-screen md:max-w-[auto]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
