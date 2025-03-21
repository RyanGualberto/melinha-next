/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Home, Building, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddressDialog } from "@/components/addresses/address-dialog";
import { AlertDialogDelete } from "@/components/ui/alert-dialog-delete";

// Dados de exemplo
const addresses = [
  {
    id: "1",
    nome: "Casa",
    rua: "Rua das Flores, 123",
    numero: "123",
    complemento: "Apto 101",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    principal: true,
  },
  {
    id: "2",
    nome: "Trabalho",
    rua: "Av. Paulista",
    numero: "1000",
    complemento: "Sala 1010",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01310-100",
    principal: false,
  },
];

export default function AddressesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    // Aqui você implementaria a lógica para excluir o endereço
    console.log(`Excluindo endereço ${id}`);
  };


  const handleSave = async (data: any) => {
    // Aqui você implementaria a lógica para salvar o endereço
    console.log("Salvando endereço:", data);
    setDialogOpen(false);
    setEditingAddress(null);
  };

  const handleSetPrincipal = (id: string) => {
    // Aqui você implementaria a lógica para definir o endereço como principal
    console.log(`Definindo endereço ${id} como principal`);
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
            setEditingAddress(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Endereço
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  {address.nome === "Casa" ? (
                    <Home className="mr-2 h-5 w-5" />
                  ) : (
                    <Building className="mr-2 h-5 w-5" />
                  )}
                  {address.nome}
                </CardTitle>
                {address.principal && (
                  <Badge variant="secondary">Principal</Badge>
                )}
              </div>
              <CardDescription>
                {address.cidade} - {address.estado}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p>
                  {address.rua}, {address.numero}
                </p>
                {address.complemento && <p>{address.complemento}</p>}
                <p>{address.bairro}</p>
                <p>CEP: {address.cep}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(address)}
                >
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
                  onClick={() => handleSetPrincipal(address.id)}
                >
                  Definir como principal
                </Button>
              )}
            </CardFooter>
          </Card>
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
