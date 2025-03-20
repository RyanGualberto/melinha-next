"use client";
import Logo from "@/assets/logo-horizontal.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Package,
  Tag,
  Layers,
  Grid,
  LogOut,
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
import Image from "next/image";

const navItems = [
  {
    title: "Início",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Pedidos",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Produtos",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/admin/categories",
    icon: Tag,
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
];

export function SidebarNav() {
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
            <SidebarMenuButton asChild tooltip="Sair">
              <Link href="/login">
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
