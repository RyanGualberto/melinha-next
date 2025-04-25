"use client";
import { ICoupon } from "@/types/coupon";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ICoupon>[] = [
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "usedCount",
    header: "Usos",
  },
  {
    accessorKey: "expiresAt",
    header: "Expira em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("expiresAt"));
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
  },
  {
    accessorKey: "active",
    header: "Ativo",
    cell: ({ row }) => {
      const active = row.getValue("active") ? "Sim" : "Não";
      return active;
    },
  },
];
