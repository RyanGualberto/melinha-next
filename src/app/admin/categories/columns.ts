"use client";

import { ICategory } from "@/types/category";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<ICategory>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
];
