"use client";
import { CategoryDialog } from "@/components/categories/category-dialog";
import CategoryAdminListItem from "@/components/menu/category-admin-list-item";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { createCategory, createCategoryPayload } from "@/requests/category";
import { listAdminMenu } from "@/requests/menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import React from "react";

export default function Page() {
  const { data: menu, isPending: loadingMenu } = useQuery({
    queryKey: ["admin-menu"],
    queryFn: async () => await listAdminMenu(),
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync: createCategoryMutation } = useMutation({
    mutationFn: async (data: createCategoryPayload) =>
      await createCategory(data),
  });

  const handleCreate = async (data: createCategoryPayload) => {
    await createCategoryMutation(data);

    queryClient.invalidateQueries({
      queryKey: ["admin-menu"],
    });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 w-full flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cardápio</h1>
          <p className="text-muted-foreground">Gerencie seu cardápio</p>
        </div>
      </div>
      <div>
        {loadingMenu && <p>Carregando...</p>}
        {!loadingMenu && !menu?.categories.length && (
          <p>Nenhuma categoria encontrada</p>
        )}
        {menu && (
          <>
            <Accordion type="single" collapsible className="w-full">
              {menu.categories.map((category) => (
                <CategoryAdminListItem key={category.id} category={category} />
              ))}
            </Accordion>
            <Button
              className="w-full mt-4"
              size="lg"
              variant="outline"
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Categoria
            </Button>
          </>
        )}
        <CategoryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          category={undefined}
          onSave={handleCreate}
        />
      </div>
    </div>
  );
}
