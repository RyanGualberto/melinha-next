"use client";

import { useCallback, useState } from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { ProductVariantCategoryDialog } from "@/components/product-variant-categories/product-variant-category-dialog";
import { columns } from "./columns";
import { IProductVariantCategory } from "@/types/product-variant-category";
import { ProductVariantCategoryFormValues } from "@/schemas/product-variant-category-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductVariantCategory,
  createProductVariantCategoryPayload,
  deleteProductVariantCategory,
  listProductVariantCategories,
  updateProductVariantCategory,
  updateProductVariantCategoryPayload,
} from "@/requests/product-variant-category";
import { ColumnDef } from "@tanstack/react-table";

export default function ProductVariantCategorysPage() {
  const queryClient = useQueryClient();
  const { data: productVariantCategories } = useQuery({
    queryKey: ["product-variant-categories"],
    queryFn: () => listProductVariantCategories(),
  });
  const { mutateAsync: createProductVariantCategoryMutation } = useMutation({
    mutationFn: async (data: createProductVariantCategoryPayload) =>
      await createProductVariantCategory(data),
  });
  const { mutateAsync: updateProductVariantCategoryMutation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: updateProductVariantCategoryPayload;
    }) => await updateProductVariantCategory(id, data),
  });
  const { mutateAsync: deleteProductVariantCategoryMutation } = useMutation({
    mutationFn: async (id: string) => await deleteProductVariantCategory(id),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProductVariantCategory, setEditingProductVariantCategory] =
    useState<IProductVariantCategory | undefined>(undefined);

  const refreshCategories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["product-variant-categories"] });
  }, [queryClient]);

  const handleEdit = useCallback((category: IProductVariantCategory) => {
    setEditingProductVariantCategory(category);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProductVariantCategoryMutation(id);
      refreshCategories();
    },
    [deleteProductVariantCategoryMutation, refreshCategories]
  );

  const handleSave = async (data: ProductVariantCategoryFormValues) => {
    if (editingProductVariantCategory) {
      await updateProductVariantCategoryMutation({
        id: editingProductVariantCategory.id,
        data: data,
      });
    } else {
      await createProductVariantCategoryMutation(data);
    }

    setDialogOpen(false);
    setEditingProductVariantCategory(undefined);
    refreshCategories();
  };

  const actionColumn: ColumnDef<IProductVariantCategory, unknown> = {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const productVariantCategory = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(productVariantCategory)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialogDelete
            title="Excluir categoria de variante"
            description="Tem certeza que deseja excluir esta categoria de variante? Esta ação não pode ser desfeita."
            onDelete={() => handleDelete(productVariantCategory.id)}
          />
        </div>
      );
    },
  };

  const allColumns = [...columns, actionColumn];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Categorias de Variantes
          </h1>
          <p className="text-muted-foreground">
            Gerencie as categorias de variantes da sua açaíteria
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProductVariantCategory(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria de Variante
        </Button>
      </div>

      <DataTable
        columns={allColumns}
        data={productVariantCategories || []}
        searchColumn="name"
        searchPlaceholder="Filtrar categorias de variantes..."
      />

      <ProductVariantCategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productVariantCategory={editingProductVariantCategory}
        onSave={handleSave}
      />
    </div>
  );
}
