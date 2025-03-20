"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { ProductDialog } from "@/components/products/product-dialog";
import { columns } from "./columns";
import { IProduct } from "@/types/product";
import { ProductFormValues } from "@/schemas/product-schema";
import { products } from "@/mock/products";

export default function ProdutosPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | undefined>(
    undefined
  );

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Simulação de exclusão
    console.log(`Produto ${id} excluído`);
    // Aqui você faria a chamada para a API
    // await deleteProduto(id)
    router.refresh();
  };

  const handleSave = async (data: ProductFormValues) => {
    // Simulação de salvamento
    console.log("Dados salvos:", data);
    // Aqui você faria a chamada para a API
    // editingProduto ? await updateProduto(data) : await createProduto(data)
    setDialogOpen(false);
    setEditingProduct(undefined);
    router.refresh();
  };

  const actionColumn = {
    id: "actions",
    header: "Ações",
    cell: ({ row }: any) => {
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
        data={products}
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
