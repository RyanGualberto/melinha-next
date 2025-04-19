"use client";
import { useEffect, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { listUsers, UsersResponse } from "@/requests/user";

interface ClientsSelectorProps {
  selectedClient: UsersResponse | null;
  setSelectedClient: (client: UsersResponse | null) => void;
}

export function ClientsSelector({
  selectedClient,
  setSelectedClient,
}: ClientsSelectorProps) {
  const [search, setSearch] = useState("");
  const {
    data: clients,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["list", "clients"],
    queryFn: async () =>
      await listUsers({
        clientName: search,
        page: 0,
        perPage: 10,
      }),
  });

  useEffect(() => {
    const debounce = setTimeout(() => {
      refetch();
    }, 600);

    return () => clearTimeout(debounce);
  }, [refetch, search]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar client por nome, email ou telefone..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="button" variant="outline" className="shrink-0">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">Buscando clientes</p>
        </div>
      ) : search.length >= 3 && clients?.data.length === 0 ? (
        <div className="text-center p-4 border rounded-md">
          <p className="text-sm text-muted-foreground">
            Nenhum cliente encontrado
          </p>
        </div>
      ) : (clients?.data.length || 0) > 0 ? (
        <ScrollArea className="h-72 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Resultados da busca
            </h4>
            {clients?.data.map((client) => (
              <div
                key={client.id}
                className={`mb-2 cursor-pointer rounded-md p-3 hover:bg-muted ${
                  selectedClient?.id === client.id
                    ? "bg-purple-50 border-purple-200 dark:bg-purple-950/20"
                    : "border"
                }`}
                onClick={() => setSelectedClient(client)}
              >
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-muted-foreground">
                  {client.email}
                </div>
                <div className="text-sm text-muted-foreground">
                  {client.phoneNumber}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : null}

      {selectedClient && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium">Cliente Selecionado</h4>
          <div className="rounded-md border p-4">
            <div className="font-medium">{selectedClient.name}</div>
            <div className="text-sm text-muted-foreground">
              {selectedClient.email}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedClient.phoneNumber}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => setSelectedClient(null)}
            >
              Remover seleção
            </Button>
          </div>
        </div>
      )}

      {!selectedClient && search.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Busque por um cliente existente ou continue sem vincular a um cliente
          </p>
        </div>
      )}
    </div>
  );
}
