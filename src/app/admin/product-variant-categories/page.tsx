"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { ProductVariantCategoryDialog } from "@/components/product-variant-categories/product-variant-category-dialog";
import { columns } from "./columns";
import { IProductVariantCategory } from "@/types/product-variant-category";
import { productVariantCategories } from "@/mock/product-variant-categories";
import { ProductVariantCategoryFormValues } from "@/schemas/product-variant-category-schema";

export default function ProductVariantCategorysPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProductVariantCategory, setEditingProductVariantCategory] =
    useState<IProductVariantCategory | undefined>(undefined);

  const handleEdit = (productVariantCategory: IProductVariantCategory) => {
    setEditingProductVariantCategory(productVariantCategory);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Simulação de exclusão
    console.log(`Categoria de Variante ${id} excluída`);
    // Aqui você faria a chamada para a API
    // await deleteProductVariantCategory(id)
    router.refresh();
  };

  const handleSave = async (data: ProductVariantCategoryFormValues) => {
    // Simulação de salvamento
    console.log("Dados salvos:", data);
    // Aqui você faria a chamada para a API
    // editingProductVariantCategory ? await updateProductVariantCategory(data) : await createProductVariantCategory(data)
    setDialogOpen(false);
    setEditingProductVariantCategory(undefined);
    router.refresh();
  };

  const actionColumn = {
    id: "actions",
    header: "Ações",
    cell: ({ row }: any) => {
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
        data={productVariantCategories}
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
