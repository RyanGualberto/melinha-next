import { ICategory } from "@/types/category";
import React, { useCallback, useState } from "react";
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
import { createProduct, createProductPayload } from "@/requests/product";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function CategoryAdminListItem({
  category,
}: {
  category: ICategory;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [name, setName] = useState(category.name);

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

  return (
    <AccordionItem key={category.id} value={category.id} className="w-full">
      <div className="flex flex-col py-2">
        <div className="flex gap-2 items-center justify-between">
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
            <span
              className="text-xl font-semibold"
              onDoubleClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setEditingName(true);
              }}
            >
              {category.name}
            </span>
          )}
          <div className="flex gap-2 items-center">
            <AccordionTrigger
              className="flex w-full min-w-full"
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
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
      <AccordionContent className="flex flex-col gap-4 pl-4">
        {category.products.map((product) => (
          <ProductAdminListItem key={product.id} product={product} />
        ))}
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
