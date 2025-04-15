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
import { Copy, Edit, MoreVertical, Trash2 } from "lucide-react";
import { AlertDialogDelete } from "../ui/alert-dialog-delete";
import { ProductDialog } from "../products/product-dialog";

export default function ProductAdminListItem({
  product,
  handleProductClick,
}: {
  product: IProduct;
  handleProductClick?: (product: IProduct) => void;
}) {
  const queryClient = useQueryClient();
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
      key={product.id}
      className="overflow-hidden cursor-pointer transition-all hover:shadow-md flex flex-row py-0 gap-2"
      onClick={() => handleProductClick?.(product)}
    >
      <div className="relative min-w-24 h-36 w-36">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-2  w-full flex-row flex items-center pr-8">
        <div className="flex flex-col mb-2 w-full ">
          <h3 className="font-semibold text-xl">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 h-14">
            {product.description}
          </p>
        </div>
        <div className="h-full flex items-center justify-center gap-3">
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-20 text-center"
          />
          <div className="text-sm bg-[#EEEEEE90] rounded-lg h-9 w-fit flex items-center overflow-hidden">
            <span
              className={cn("p-4 flex items-center justify-center", {
                "bg-purple-800 text-white": product.status === "INACTIVE",
              })}
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
              Pausado
            </span>
            <span
              className={cn("p-4 flex items-center justify-center", {
                "bg-purple-800 text-white": product.status === "ACTIVE",
              })}
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
              Ativado
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
              <MoreVertical size={16} />
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
