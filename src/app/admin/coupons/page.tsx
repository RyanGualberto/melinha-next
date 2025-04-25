"use client";

import { useCallback, useState } from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";
import { CouponDialog } from "@/components/coupons/coupons-dialog";
import { columns } from "./columns";
import { ICoupon } from "@/types/coupon";
import { CouponFormValues } from "@/schemas/coupon-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCoupon,
  createCouponPayload,
  deleteCoupon,
  listCoupons,
  updateCoupon,
  updateCouponPayload,
} from "@/requests/coupon";
import { ColumnDef } from "@tanstack/react-table";

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const { data: coupons } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => listCoupons(),
  });
  const { mutateAsync: createCouponMutation } = useMutation({
    mutationFn: async (data: createCouponPayload) => await createCoupon(data),
  });
  const { mutateAsync: updateCouponMutation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: updateCouponPayload;
    }) => await updateCoupon(id, data),
  });
  const { mutateAsync: deleteCouponMutation } = useMutation({
    mutationFn: async (id: string) => await deleteCoupon(id),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | undefined>(
    undefined
  );

  const refreshCategories = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["coupons"] });
  }, [queryClient]);

  const handleEdit = useCallback((category: ICoupon) => {
    setEditingCoupon(category);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteCouponMutation(id);
      refreshCategories();
    },
    [deleteCouponMutation, refreshCategories]
  );

  const handleSave = async (data: CouponFormValues) => {
    if (editingCoupon) {
      await updateCouponMutation({
        id: editingCoupon.id,
        data: data,
      });
    } else {
      await createCouponMutation(data);
    }

    setDialogOpen(false);
    setEditingCoupon(undefined);
    refreshCategories();
  };

  const actionColumn: ColumnDef<ICoupon, unknown> = {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const coupon = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(coupon)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialogDelete
            title="Excluir cupom"
            description="Tem certeza que deseja excluir este cupom? Esta ação não pode ser desfeita."
            onDelete={() => handleDelete(coupon.id)}
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
          <h1 className="text-3xl font-bold tracking-tight">
            Cupons
          </h1>
          <p className="text-muted-foreground">
            Gerencie os cupons da sua açaíteria
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCoupon(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Cupom
        </Button>
      </div>

      <DataTable
        columns={allColumns}
        data={coupons || []}
        searchColumn="code"
        searchPlaceholder="Filtrar cupons..."
      />

      <CouponDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coupon={editingCoupon}
        onSave={handleSave}
      />
    </div>
  );
}
