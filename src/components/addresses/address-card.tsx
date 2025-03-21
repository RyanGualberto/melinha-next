import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { IAddress } from "@/types/address";
import { AlertDialogDelete } from "../ui/alert-dialog-delete";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export function AddressCard({
  address,
  handleEdit,
  handleDelete,
  handleSetPrincipal,
}: {
  address: IAddress;
  handleEdit: (address: IAddress) => void;
  handleDelete: (id: string) => Promise<void>;
  handleSetPrincipal: (address: IAddress) => Promise<void>;
}) {
  return (
    <Card key={address.id}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg">
            {address.name}
          </CardTitle>
          {address.principal && <Badge variant="secondary">Principal</Badge>}
        </div>
        <CardDescription>
          {address.city} - {address.state}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <p>
            {address.address}, {address.number}
          </p>
          {address.complement && <p>{address.complement}</p>}
          <p>{address.district}</p>
          <p>CEP: {address.zipCode}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleEdit(address)}>
            <Edit className="mr-1 h-4 w-4" />
            Editar
          </Button>
          <AlertDialogDelete
            title="Excluir endereço"
            description="Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita."
            onDelete={() => handleDelete(address.id)}
          />
        </div>
        {!address.principal && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSetPrincipal(address)}
          >
            Definir como principal
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
