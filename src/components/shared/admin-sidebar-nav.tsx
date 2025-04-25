"use client";
import Logo from "@/assets/logo-horizontal.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Layers,
  Grid,
  LogOut,
  Users,
  Settings2,
  ChartNoAxesCombined,
  Menu,
  Tickets,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/user-context";

const navItems = [
  {
    title: "Início",
    href: "/admin/dashboard",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Cardápio",
    href: "/admin/menu",
    icon: Menu,
  },
  {
    title: "Variantes",
    href: "/admin/product-variants",
    icon: Layers,
  },
  {
    title: "Categoria de Variantes",
    href: "/admin/product-variant-categories",
    icon: Grid,
  },
  {
    title: "Clientes",
    href: "/admin/clients",
    icon: Users,
  },
  {
    title: "Cupons",
    href: "/admin/coupons",
    icon: Tickets,
  },
];

export function SidebarNav() {
  const { logout } = useAuthContext();
  const pathname = usePathname();

  return (
    <Sidebar className="w-fit px-4 bg-sidebar">
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Image src={Logo} height={40} width={120} alt="MELINHA" />
        </div>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sair" asChild>
              <Link href="/admin/settings">
                <Settings2 className="h-5 w-5" />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip="Sair">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
