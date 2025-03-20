"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { ProductVariantDialog } from "@/components/product-variants/product-variant-dialog";
import { columns } from "./columns";
import { IProductVariant } from "@/types/product-variant";
import { productVariants } from "@/mock/product-variants";
import { ProductVariantFormValues } from "@/schemas/product-variant-schema";
import { ColumnDef } from "@tanstack/react-table";

// Dados de exemplo

export default function ProductVariantsPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProductVariant, setEditingProductVariant] = useState<
    IProductVariant | undefined
  >(undefined);

  const handleEdit = (variante: IProductVariant) => {
    setEditingProductVariant(variante);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Simulação de exclusão
    console.log(`Variant ${id} excluída`);
    // Aqui você faria a chamada para a API
    // await deleteVariant(id)
    router.refresh();
  };

  const handleSave = async (data: ProductVariantFormValues) => {
    // Simulação de salvamento
    console.log("Dados salvos:", data);
    // Aqui você faria a chamada para a API
    // editingVariant ? await updateVariant(data) : await createVariant(data)
    setDialogOpen(false);
    setEditingProductVariant(undefined);
    router.refresh();
  };

  const actionColumn: ColumnDef<IProductVariant, unknown> = {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const variante = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(variante)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialogDelete
            title="Excluir variante"
            description="Tem certeza que deseja excluir esta variante? Esta ação não pode ser desfeita."
            onDelete={() => handleDelete(variante.id)}
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
        data={productVariants}
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
