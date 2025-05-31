import React, { useCallback, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { IProduct } from "@/types/product";
import { Input } from "../ui/input";
import {
  createProduct,
  createProductPayload,
  deleteProduct,
  updateProduct,
  updateProductPayload,
} from "@/requests/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Copy,
  Edit,
  GripVertical,
  MoreVertical,
  Pause,
  Play,
  Trash2,
} from "lucide-react";
import { AlertDialogDelete } from "../ui/alert-dialog-delete";
import { ProductDialog } from "../products/product-dialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ProductAdminListItem({
  product,
}: {
  product: IProduct;
}) {
  const queryClient = useQueryClient();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };
  const [price, setPrice] = useState(String(product.price));
  const [openDropdown, setOpenDropdown] = useState(false);
  const [alertDialogDeleteOpen, setAlertDialogDeleteOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { mutateAsync: createProductMutation } = useMutation({
    mutationFn: async (data: createProductPayload) => await createProduct(data),
  });
  const { mutateAsync: updateProductMutation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: updateProductPayload;
    }) => await updateProduct(id, data),
  });
  const { mutateAsync: deleteProductMutation } = useMutation({
    mutationFn: async (id: string) => await deleteProduct(id),
  });

  const refreshMenu = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["admin-menu"] });
  }, [queryClient]);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProductMutation(id);
      refreshMenu();
      setAlertDialogDeleteOpen(false);
    },
    [deleteProductMutation, refreshMenu]
  );

  const handleEdit = async (data: updateProductPayload) => {
    await updateProductMutation({
      id: product.id,
      data: data,
    });

    refreshMenu();
    setPrice(String(data.price));
    setOpenDialog(false);
  };

  const duplicate = async (data: createProductPayload) => {
    await createProductMutation(data);
    refreshMenu();
  };

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (price === String(product.price)) return;
      handleEdit({
        title: product.title,
        description: product.description,
        image: product.image,
        price: parseFloat(String(price)),
        status: product.status,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [price]);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md flex flex-row py-0 gap-2 items-center border-none shadow-none rounded-none pl-1 md:pl-4 ${
        isDragging
          ? "bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800"
          : ""
      } `}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab p-1 mr-2 rounded hover:bg-muted active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-center w-full">
        <div className="relative min-w-24 h-36 w-36">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-2 w-full flex-col md:flex-row flex items-center pr-8">
          <div className="flex flex-col mb-2 w-full ">
            <h3 className="font-semibold text-xl">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 h-14">
              {product.description}
            </p>
          </div>
          <div className="h-full flex flex-col md:flex-row items-center justify-center gap-3">
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-20 text-center"
            />
            <div className="text-sm bg-[#EEEEEE90] rounded-lg h-9 w-fit flex items-center overflow-hidden">
              <span
                className={cn(
                  "p-4 flex items-center justify-center cursor-pointer", {
                    "text-purple-800": product.status === "INACTIVE",
                    "text-muted-foreground": product.status === "ACTIVE",
                  }
                )}
                onClick={() => {
                  handleEdit({
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    status: "INACTIVE",
                    title: product.title,
                  });
                }}
              >
                <Pause
                  size={12}
                />
              </span>
              <span
                className={cn(
                  "p-4 flex items-center justify-center cursor-pointer", {
                    "text-purple-800": product.status === "ACTIVE",
                    "text-muted-foreground": product.status === "INACTIVE",
                  }
                )}
                onClick={() => {
                  handleEdit({
                    description: product.description,
                    image: product.image,
                    price: product.price,
                    status: "ACTIVE",
                    title: product.title,
                  });
                }}
              >
                <Play size={12} />
              </span>
            </div>
            <ProductDialog
              onSave={handleEdit}
              categoryId={product.categoryId}
              product={product}
              open={openDialog}
              setOpen={setOpenDialog}
            />
            <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
              <DropdownMenuTrigger className="">
                <MoreVertical size={16} className="hidden md:block" />
                <span className="block md:hidden">Mais ações</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDropdown(false);
                    setOpenDialog(true);
                  }}
                >
                  <Edit size={12} />
                  Editar item
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    setOpenDropdown(false);
                    duplicate({
                      description: product.description,
                      image: product.image,
                      price: product.price,
                      status: product.status,
                      title: product.title,
                      categoryId: product.categoryId,
                    });
                  }}
                >
                  <Copy size={12} />
                  Duplicar item
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    setOpenDropdown(false);
                    setAlertDialogDeleteOpen(true);
                  }}
                >
                  <Trash2 size={12} />
                  Remover item
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </div>
      <AlertDialogDelete
        hideTrigger
        _open={alertDialogDeleteOpen}
        _setOpen={setAlertDialogDeleteOpen}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        onDelete={() => handleDelete(product.id)}
      />
    </Card>
  );
}
