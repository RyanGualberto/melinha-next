import { ICategory } from "@/types/category";
import React, { useCallback, useEffect, useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import ProductAdminListItem from "./product-admin-list-item";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  deleteCategory,
  updateCategory,
  updateCategoryPayload,
} from "@/requests/category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialogDelete } from "../ui/alert-dialog-delete";
import { ProductDialog } from "../products/product-dialog";
import {
  createProduct,
  createProductPayload,
  updateOrderProduct,
  UpdateProductOrderPayload,
} from "@/requests/product";
import { Button } from "../ui/button";
import { GripVertical, Plus } from "lucide-react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

export default function CategoryAdminListItem({
  category,
}: {
  category: ICategory;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [name, setName] = useState(category.name);
  const [products, setProducts] = useState(category.products);

  const { mutateAsync: updateCategoryMutation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: updateCategoryPayload;
    }) => await updateCategory(id, data),
  });
  const { mutateAsync: updateOrderProductMutation } = useMutation({
    mutationFn: async (data: Array<UpdateProductOrderPayload>) =>
      await updateOrderProduct(data),
  });
  const { mutateAsync: deleteCategoryMutation } = useMutation({
    mutationFn: async (id: string) => await deleteCategory(id),
  });

  const { mutateAsync: createProductMutation } = useMutation({
    mutationFn: async (data: createProductPayload) => await createProduct(data),
  });

  const refreshMenu = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
  }, [queryClient]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteCategoryMutation(id);
      refreshMenu();
    },
    [deleteCategoryMutation, refreshMenu]
  );

  const handleEdit = async (id: string, data: updateCategoryPayload) => {
    await updateCategoryMutation({
      id: id,
      data: data,
    });

    setEditingName(false);
    refreshMenu();
  };

  const handleSaveProduct = async (data: createProductPayload) => {
    await createProductMutation(data);
    setOpen(false);
    refreshMenu();
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  useEffect(() => {
    const updateProducts = async () => {
      const data = products.map((category, index) => ({
        id: category.id,
        index: index + 1,
      }));

      await updateOrderProductMutation(data);
    };

    updateProducts();
  }, [products, updateOrderProductMutation]);

  useEffect(() => {
    setProducts(category.products);
  }, [category.products]);

  return (
    <AccordionItem
      ref={setNodeRef}
      style={style}
      className={`w-full items-center p-1 md:p-3 mb-2 rounded-md ${
        isDragging
          ? "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800"
          : ""
      } `}
      value={category.id}
    >
      <div className="flex w-full items-center">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab p-1 mr-2 rounded hover:bg-muted active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex flex-col py-2 w-full gap-2 md:gap-0">
          <div className="flex gap-0 md:gap-2 flex-col md:flex-row items-start md:items-center justify-between">
            {editingName ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  setEditingName(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEdit(category.id, {
                      name: name,
                      description: category.description || "",
                      status: category.status,
                    });
                  }
                }}
                className="w-full"
                required
              />
            ) : (
              <div className="flex gap-2 items-center w-full">
                <span
                  className="text-xl font-semibold w-full"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setEditingName(true);
                  }}
                >
                  {category.name}
                </span>
                <AccordionTrigger
                  className="flex w-full min-w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </div>
            )}
            <div className="flex gap-2 items-center">
              <div className="text-sm bg-[#EEEEEE90] rounded-lg h-9 w-fit flex items-center overflow-hidden">
                <span
                  className={cn("p-4 flex items-center justify-center", {
                    "bg-purple-800 text-white": category.status === "INACTIVE",
                  })}
                  onClick={() => {
                    handleEdit(category.id, {
                      name: category.name,
                      description: category.description || "",
                      status: "INACTIVE",
                    });
                  }}
                >
                  Pausado
                </span>
                <span
                  className={cn("p-4 flex items-center justify-center", {
                    "bg-purple-800 text-white": category.status === "ACTIVE",
                  })}
                  onClick={() => {
                    handleEdit(category.id, {
                      name: category.name,
                      description: category.description || "",
                      status: "ACTIVE",
                    });
                  }}
                >
                  Ativado
                </span>
              </div>
              <AlertDialogDelete
                title="Excluir categorias"
                description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
                onDelete={() => handleDelete(category.id)}
              />
            </div>
          </div>
          <div>
            {editingDescription ? (
              <Input
                value={category.description || ""}
                onChange={(e) => {
                  handleEdit(category.id, {
                    name: category.name,
                    description: e.target.value,
                    status: category.status,
                  });
                }}
                onBlur={() => {
                  setEditingDescription(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingDescription(false);
                  }
                }}
                className="w-full"
              />
            ) : (
              <span
              className=""
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setEditingDescription(true);
                }}
              >
                {category.description}
              </span>
            )}
          </div>
        </div>
      </div>
      <AccordionContent className="flex flex-col gap-4 pl-1 md:pl-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={products.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {products.map((product) => (
              <ProductAdminListItem key={product.id} product={product} />
            ))}
          </SortableContext>
        </DndContext>
        <Button
          onClick={() => setOpen(true)}
          className="w-full mt-4"
          size="lg"
          variant="outline"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </AccordionContent>
      <ProductDialog
        product={undefined}
        categoryId={category.id}
        onSave={handleSaveProduct}
        open={open}
        setOpen={setOpen}
      />
    </AccordionItem>
  );
}
