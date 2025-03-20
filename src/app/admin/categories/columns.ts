"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type Categoria = {
  id: string;
  name: string;
  description: string;
};

export const columns: ColumnDef<Categoria>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
];
