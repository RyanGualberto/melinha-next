import type React from "react";
import { SidebarNav } from "@/components/shared/admin-sidebar-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebarMobileTrigger from "@/components/shared/admin-sidebar-mobile-trigger";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col w-screen">
        <div className="flex flex-1">
          <AdminSidebarMobileTrigger />
          <SidebarNav />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
