"use client";

import { useCallback, useState } from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { ProductDialog } from "@/components/products/product-dialog";
import { columns } from "./columns";
import { IProduct } from "@/types/product";
import { ProductFormValues } from "@/schemas/product-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  createProductPayload,
  deleteProduct,
  listProducts,
  updateProduct,
  updateProductPayload,
} from "@/requests/product";
import { ColumnDef } from "@tanstack/react-table";

export default function ProdutosPage() {
  const queryClient = useQueryClient();
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | undefined>(
    undefined
  );

  const refreshProducts = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }, [queryClient]);

  const handleEdit = useCallback((product: IProduct) => {
    setEditingProduct(product);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProductMutation(id);
      refreshProducts();
    },
    [deleteProductMutation, refreshProducts]
  );

  const handleSave = async (data: ProductFormValues) => {
    if (editingProduct) {
      await updateProductMutation({
        id: editingProduct.id,
        data: data,
      });
    } else {
      await createProductMutation(data);
    }

    setDialogOpen(false);
    setEditingProduct(undefined);
    refreshProducts();
  };

  const actionColumn: ColumnDef<IProduct, unknown> = {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialogDelete
            title="Excluir produto"
            description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
            onDelete={() => handleDelete(product.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos da sua açaíteria
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      <DataTable
        columns={allColumns}
        data={products || []}
        searchColumn="title"
        searchPlaceholder="Filtrar produtos..."
      />

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={handleSave}
      />
    </div>
  );
}
