"use client";
import { useCallback, useState } from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { columns } from "./columns";
import { ICategory } from "@/types/category";
import { CategoryFormValues } from "@/schemas/category-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  createCategoryPayload,
  deleteCategory,
  listCategories,
  updateCategory,
  updateCategoryPayload,
} from "@/requests/category";
import { ColumnDef } from "@tanstack/react-table";

export default function CategorysPage() {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(),
  });
  const { mutateAsync: createCategoryMutation } = useMutation({
    mutationFn: async (data: createCategoryPayload) =>
      await createCategory(data),
  });
  const { mutateAsync: updateCategoryMutation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: updateCategoryPayload;
    }) => await updateCategory(id, data),
  });
  const { mutateAsync: deleteCategoryMutation } = useMutation({
    mutationFn: async (id: string) => await deleteCategory(id),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | undefined>(
    undefined
  );

  const refreshCategories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }, [queryClient]);

  const handleEdit = useCallback((category: ICategory) => {
    setEditingCategory(category);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteCategoryMutation(id);
      refreshCategories();
    },
    [deleteCategoryMutation, refreshCategories]
  );

  const handleSave = async (data: CategoryFormValues) => {
    if (editingCategory) {
      await updateCategoryMutation({
        id: editingCategory.id,
        data: data,
      });
    } else {
      await createCategoryMutation(data);
    }

    setDialogOpen(false);
    setEditingCategory(undefined);
    refreshCategories();
  };

  const actionColumn: ColumnDef<ICategory, unknown> = {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
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
        data={(categories || []).map((category) => ({
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
