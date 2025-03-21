"use client";
import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressDialog } from "@/components/addresses/address-dialog";
import {
  createAddress,
  createAddressPayload,
  deleteAddress,
  listAddresses,
  updateAddress,
  updateAddressPayload,
} from "@/requests/address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressFormValues } from "@/schemas/address-schema";
import { IAddress } from "@/types/address";
import { AddressCard } from "@/components/addresses/address-card";

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => listAddresses(),
  });
  const { mutateAsync: createAddressMutation } = useMutation({
    mutationFn: async (data: createAddressPayload) => await createAddress(data),
  });
  const { mutateAsync: updateAddressMutation } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: updateAddressPayload;
    }) => await updateAddress(id, data),
  });
  const { mutateAsync: deleteAddressMutation } = useMutation({
    mutationFn: async (id: string) => await deleteAddress(id),
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | undefined>(
    undefined
  );

  const refreshAddresses = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  }, [queryClient]);

  const handleEdit = useCallback((address: IAddress) => {
    setEditingAddress(address);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteAddressMutation(id);
      refreshAddresses();
    },
    [deleteAddressMutation, refreshAddresses]
  );

  const handleSave = async (data: AddressFormValues) => {
    if (editingAddress) {
      await updateAddressMutation({
        id: editingAddress.id,
        data: data,
      });
    } else {
      await createAddressMutation(data);
    }

    setDialogOpen(false);
    setEditingAddress(undefined);
    refreshAddresses();
  };

  const handleSetPrincipal = async (address: IAddress) => {
    await updateAddressMutation({
      id: address.id,
      data: {
        ...address,
        principal: true,
      },
    });
    refreshAddresses();
  };

  return (
    <div className="container py-8 px-4 sm:px-0">
      <div className="flex gap-2 justify-center md:justify-between mb-8 flex-col md:flex-row">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Meus Endereços
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus endereços de entrega
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingAddress(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Endereço
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {(addresses || []).map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleSetPrincipal={handleSetPrincipal}
          />
        ))}
      </div>

      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editingAddress}
        onSave={handleSave}
      />
    </div>
  );
}
