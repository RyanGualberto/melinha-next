"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { columns } from "./columns";
import { ICategory } from "@/types/category";
import { CategoryFormValues } from "@/schemas/category-schema";
import { categories } from "@/mock/categories";

export default function CategorysPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | undefined>(
    undefined
  );

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Simulação de exclusão
    console.log(`Categoria ${id} excluída`);
    // Aqui você faria a chamada para a API
    // await deleteCategory(id)
    router.refresh();
  };

  const handleSave = async (data: CategoryFormValues) => {
    // Simulação de salvamento
    console.log("Dados salvos:", data);
    // Aqui você faria a chamada para a API
    // editingCategory ? await updateCategory(data) : await createCategory(data)
    setDialogOpen(false);
    setEditingCategory(undefined);
    router.refresh();
  };

  const actionColumn = {
    id: "actions",
    header: "Ações",
    cell: ({ row }: any) => {
      const category = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(category)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialogDelete
            title="Excluir categorias"
            description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
            onDelete={() => handleDelete(category.id)}
          />
        </div>
      );
    },
  };

  const allColumns = [...columns, actionColumn];

  return (
    <div className="space-y-6 w-full flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias de produtos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>
      </div>

      <DataTable
        columns={allColumns}
        data={categories.map((category) => ({
          ...category,
          description: category.description || "",
        }))}
        searchColumn="name"
        searchPlaceholder="Filtrar categorias..."
      />

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSave}
      />
    </div>
  );
}
