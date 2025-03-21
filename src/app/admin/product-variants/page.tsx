"use client";

import { useCallback, useState } from "react";
import { Copy, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { ProductVariantDialog } from "@/components/product-variants/product-variant-dialog";
import { columns } from "./columns";
import { IProductVariant } from "@/types/product-variant";
import { ProductVariantFormValues } from "@/schemas/product-variant-schema";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProductVariant,
  createProductVariantPayload,
  deleteProductVariant,
  listProductVariants,
  updateProductVariant,
  updateProductVariantPayload,
} from "@/requests/product-variant";

export default function ProductVariantsPage() {
  const queryClient = useQueryClient();
  const { data: productVariants } = useQuery({
    queryKey: ["product-variants"],
    queryFn: () => listProductVariants(),
  });
  const { mutateAsync: createProductVariantMutation } = useMutation({
    mutationFn: async (data: createProductVariantPayload) =>
      await createProductVariant(data),
  });
  const { mutateAsync: updateProductVariantMutation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: updateProductVariantPayload;
    }) => await updateProductVariant(id, data),
  });
  const { mutateAsync: deleteProductVariantMutation } = useMutation({
    mutationFn: async (id: string) => await deleteProductVariant(id),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProductVariant, setEditingProductVariant] = useState<
    IProductVariant | undefined
  >(undefined);

  const refreshProductVariants = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["product-variants"] });
  }, [queryClient]);

  const handleEdit = useCallback((category: IProductVariant) => {
    setEditingProductVariant(category);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProductVariantMutation(id);
      refreshProductVariants();
    },
    [deleteProductVariantMutation, refreshProductVariants]
  );

  const handleSave = async (data: ProductVariantFormValues) => {
    if (editingProductVariant) {
      await updateProductVariantMutation({
        id: editingProductVariant.id,
        data: data,
      });
    } else {
      await createProductVariantMutation(data);
    }

    setDialogOpen(false);
    setEditingProductVariant(undefined);
    refreshProductVariants();
  };

  const duplicate = async (data: ProductVariantFormValues) => {
    await createProductVariantMutation(data);
    refreshProductVariants();
  };

  const actionColumn: ColumnDef<IProductVariant, unknown> = {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const variant = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => duplicate(variant)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(variant)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialogDelete
            title="Excluir variante"
            description="Tem certeza que deseja excluir esta variante? Esta ação não pode ser desfeita."
            onDelete={() => handleDelete(variant.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Variantes</h1>
          <p className="text-muted-foreground">
            Gerencie as variantes de produtos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProductVariant(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Variante
        </Button>
      </div>

      <DataTable
        columns={allColumns}
        data={productVariants || []}
        searchColumn="name"
        searchPlaceholder="Filtrar variantes..."
      />

      <ProductVariantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productVariant={editingProductVariant}
        onSave={handleSave}
      />
    </div>
  );
}
