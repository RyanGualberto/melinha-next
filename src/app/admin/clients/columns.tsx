"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ListUsersResponse } from "@/requests/user";

export const columns: ColumnDef<ListUsersResponse>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span className="px-3">{row.getValue("name")}</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Telefone",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cliente Desde
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");

      return (
        <span className="px-3">
          {new Date(String(createdAt)).toLocaleDateString("pt-BR")}
        </span>
      );
    },
  },
  {
    accessorKey: "qtOrders",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pedidos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const qtOrders = row.getValue("qtOrders") as number;
      return <span className="px-3">{qtOrders}</span>;
    },
    enableSorting: true,
  },

  {
    accessorKey: "lastOrder",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Último Pedido
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableSorting: true,
    cell: ({ row }) => {
      const lastOrder = row.getValue("lastOrder") as Date | null;

      return (
        <span
          className="px-3"
        >
          {lastOrder
            ? new Date(String(lastOrder)).toLocaleDateString("pt-BR")
            : "Nenhum pedido"}
        </span>
      );
    },
  },
];
