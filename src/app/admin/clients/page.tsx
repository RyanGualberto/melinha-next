"use client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/requests/user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";

export default function UsersPage() {
  const {
    data: users,
    refetch,
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await listUsers(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes da sua loja.
          </p>
        </div>
        <Button
          variant="outline"
          className={cn("hidden md:inline-flex", {
            "animate-pulse": loadingUsers,
          })}
          onClick={() => refetch()}
        >
          <RefreshCcw
            className={cn("h-4 w-4", {
              "animate-spin": loadingUsers,
            })}
          />
          Atualizar
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users || []}
        searchColumn="name"
        searchPlaceholder="Filtrar Clientes..."
      />
    </div>
  );
}
