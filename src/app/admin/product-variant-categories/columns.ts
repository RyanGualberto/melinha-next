"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type CategoriaVariante = {
  id: string;
  name: string;
};

export const columns: ColumnDef<CategoriaVariante>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
];
