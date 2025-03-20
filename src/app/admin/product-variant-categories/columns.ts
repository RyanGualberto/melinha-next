"use client";

import { IProductVariantCategory } from "@/types/product-variant-category";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<IProductVariantCategory>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
];
