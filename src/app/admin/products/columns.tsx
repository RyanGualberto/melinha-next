"use client";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export type Produto = {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  image: string;
  categoryId: string;
  category: { name: string };
};

export const columns: ColumnDef<Produto>[] = [
  {
    accessorKey: "image",
    header: "Imagem",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      return (
        <div className="relative h-10 w-10 overflow-hidden rounded-md">
          <Image
            src={image || "/placeholder.svg"}
            alt={row.getValue("title")}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Nome",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "ativo" ? "default" : "secondary"}>
          {status === "ativo" ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
];
