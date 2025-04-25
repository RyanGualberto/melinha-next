"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { ProductVariantDialog } from "@/components/product-variants/product-variant-dialog";
import { columns } from "./columns";
import { IProductVariant } from "@/types/product-variant";
import {
  ProductVariantFormValues,
  ProductVariantManyFormValues,
} from "@/schemas/product-variant-schema";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createManyProductVariant,
  createProductVariant,
  createProductVariantPayload,
  deleteManyProductVariant,
  deleteProductVariant,
  listProductVariants,
  updateManyProductVariant,
  updateManyProductVariantPayload,
  updateProductVariant,
  updateProductVariantPayload,
} from "@/requests/product-variant";
import { ProductVariantManyDialog } from "@/components/product-variants/product-variant-many-dialog";

export default function ProductVariantsPage() {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<IProductVariant[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<RowSelectionState>({});
  const queryClient = useQueryClient();
  const { data: productVariants } = useQuery({
    queryKey: ["product-variants"],
    queryFn: async () =>
      await listProductVariants({ page, perPage, productVariantName: search }),
  });
  const { mutateAsync: createProductVariantMutation } = useMutation({
    mutationFn: async (data: createProductVariantPayload) =>
      await createProductVariant(data),
  });
  const { mutateAsync: createManyProductVariantMutation } = useMutation({
    mutationFn: async (data: createProductVariantPayload[]) =>
      await createManyProductVariant(data),
  });
  const { mutateAsync: updateProductVariantMutation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: updateProductVariantPayload;
    }) => await updateProductVariant(id, data),
  });
  const { mutateAsync: updateManyProductVariantMutation } = useMutation({
    mutationFn: async ({
      ids,
      data,
    }: {
      ids: string[];
      data: updateManyProductVariantPayload;
    }) => await updateManyProductVariant(ids, data),
  });
  const { mutateAsync: deleteProductVariantMutation } = useMutation({
    mutationFn: async (id: string) => await deleteProductVariant(id),
  });
  const { mutateAsync: deleteManyProductVariantMutation } = useMutation({
    mutationFn: async (ids: string[]) => await deleteManyProductVariant(ids),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogManyOpen, setDialogManyOpen] = useState(false);
  const [editingProductVariant, setEditingProductVariant] = useState<
    IProductVariant | undefined
  >(undefined);

  const refreshProductVariants = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["product-variants"] });
  }, [queryClient]);

  const handleEdit = useCallback((category: IProductVariant) => {
    setEditingProductVariant(category);
    setDialogOpen(true);
  }, []);

  const handleEditMany = useCallback(() => {
    setDialogManyOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProductVariantMutation(id);
      refreshProductVariants();
    },
    [deleteProductVariantMutation, refreshProductVariants]
  );

  const handleDeleteMany = useCallback(
    async (ids: string[]) => {
      await deleteManyProductVariantMutation(ids);
      refreshProductVariants();
      setSelectedRows([]);
      setSelectedIndexes({});
    },
    [deleteManyProductVariantMutation, refreshProductVariants]
  );

  const handleSave = useCallback(
    async (data: ProductVariantFormValues) => {
      if (editingProductVariant) {
        await updateProductVariantMutation({
          id: editingProductVariant.id,
          data: data,
        });
      } else {
        await createProductVariantMutation(data);
      }

      setDialogOpen(false);
      setEditingProductVariant(undefined);
      refreshProductVariants();
    },
    [
      editingProductVariant,
      refreshProductVariants,
      updateProductVariantMutation,
      createProductVariantMutation,
    ]
  );

  const handleSaveEditMany = useCallback(
    async (data: ProductVariantManyFormValues) => {
      await updateManyProductVariantMutation({
        ids: selectedRows.map((row) => row.id),
        data: {
          price: data.price,
          status: data.status,
          productId: data.productId,
          productVariantCategoryId: data.productVariantCategoryId,
        },
      });
      setDialogManyOpen(false);
      setEditingProductVariant(undefined);
      refreshProductVariants();
    },
    [refreshProductVariants, updateManyProductVariantMutation, selectedRows]
  );

  const duplicate = useCallback(
    async (data: ProductVariantFormValues) => {
      await createProductVariantMutation(data);
      refreshProductVariants();
    },
    [refreshProductVariants, createProductVariantMutation]
  );

  const duplicateMany = useCallback(
    async (data: ProductVariantFormValues[]) => {
      await createManyProductVariantMutation(data);
      refreshProductVariants();
    },
    [refreshProductVariants, createManyProductVariantMutation]
  );

  const actionColumn: ColumnDef<IProductVariant, unknown> = {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const variant = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => duplicate(variant)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(variant)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialogDelete
            title="Excluir variante"
            description="Tem certeza que deseja excluir esta variante? Esta ação não pode ser desfeita."
            onDelete={() => handleDelete(variant.id)}
          />
        </div>
      );
    },
  };

  const allColumns = [...columns, actionColumn];

  useEffect(() => {
    refreshProductVariants();
  }, [page, perPage, search, refreshProductVariants]);

  useEffect(() => {
    const selectedRows = productVariants?.data.filter(
      (pv) => pv.id in selectedIndexes
    );
    setSelectedRows(selectedRows || []);
  }, [selectedIndexes, productVariants]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Variantes</h1>
          <p className="text-muted-foreground">
            Gerencie as variantes de produtos.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProductVariant(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Variante
        </Button>
      </div>

      {selectedRows.length > 0 && (
        <div className="flex items-center justify-between">
          <p>
            {selectedRows.length}{" "}
            {selectedRows.length > 1
              ? "variantes selecionadas"
              : "variante selecionada"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                duplicateMany(
                  selectedRows.map((row) => {
                    return {
                      name: row.name,
                      price: row.price,
                      status: row.status,
                      productId: row.productId,
                      productVariantCategoryId: row.productVariantCategoryId,
                      image: row.image,
                    };
                  })
                )
              }
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEditMany()}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialogDelete
              title="Excluir variantes selecionadas"
              description="Tem certeza que deseja excluir essas variantes? Esta ação não pode ser desfeita."
              onDelete={() =>
                handleDeleteMany(selectedRows.map((row) => row.id))
              }
            />
          </div>
        </div>
      )}

      <DataTable
        columns={allColumns}
        data={productVariants?.data || []}
        searchColumn="name"
        searchPlaceholder="Filtrar variantes..."
        onFilterChange={setSearch}
        selectedRows={selectedIndexes}
        setSelectedRows={setSelectedIndexes}
        length={productVariants?.pagination.total || 0}
        onPageChange={(value) => setPage(value)}
        onPageSizeChange={(value) => setPerPage(value)}
      />

      <ProductVariantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productVariant={editingProductVariant}
        onSave={handleSave}
      />
      <ProductVariantManyDialog
        open={dialogManyOpen}
        onOpenChange={setDialogManyOpen}
        productVariant={selectedRows[0]}
        onSave={handleSaveEditMany}
      />
    </div>
  );
}
