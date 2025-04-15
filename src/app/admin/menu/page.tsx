"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CategoryDialog } from "@/components/categories/category-dialog";
import CategoryAdminListItem from "@/components/menu/category-admin-list-item";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  createCategory,
  createCategoryPayload,
  updateOrderCategory,
  updateCategoryOrderPayload,
} from "@/requests/category";
import { listAdminMenu } from "@/requests/menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Page() {
  const { data: menu, isPending: loadingMenu } = useQuery({
    queryKey: ["admin-menu"],
    queryFn: async () => await listAdminMenu(),
  });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [categories, setCategories] = useState(menu?.categories || []);

  const queryClient = useQueryClient();
  const { mutateAsync: createCategoryMutation } = useMutation({
    mutationFn: async (data: createCategoryPayload) =>
      await createCategory(data),
  });
  const { mutateAsync: updateOrderCategoryMutation } = useMutation({
    mutationFn: async (data: Array<updateCategoryOrderPayload>) =>
      await updateOrderCategory(data),
  });

  const handleCreate = useCallback(
    async (data: createCategoryPayload) => {
      await createCategoryMutation(data);

      queryClient.invalidateQueries({
        queryKey: ["admin-menu"],
      });
      setDialogOpen(false);
    },
    [createCategoryMutation, queryClient]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  useEffect(() => {
    const updateOrder = async () => {
      const data = categories.map((category, index) => ({
        id: category.id,
        index: index + 1,
      }));

      await updateOrderCategoryMutation(data);
    };

    updateOrder();
  }, [categories, updateOrderCategoryMutation]);

  useEffect(() => {
    if (menu) {
      setCategories(menu.categories);
    }
  }, [menu]);

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <Accordion type="single" collapsible className="w-full">
                  {categories.map((category) => (
                    <CategoryAdminListItem
                      key={category.id}
                      category={category}
                    />
                  ))}
                </Accordion>
              </SortableContext>
            </DndContext>
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
          onSave={(data) =>
            handleCreate({
              ...data,
              index: categories.length + 1,
            })
          }
        />
      </div>
    </div>
  );
}
