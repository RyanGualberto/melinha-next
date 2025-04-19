"use client";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/requests/user";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [clientName, setClientName] = useState("");
  const {
    data: users,
    refetch,
    isLoading: loadingUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () =>
      await listUsers({
        page,
        perPage,
        clientName,
      }),
  });

  useEffect(() => {
    refetch();
  }, [page, perPage, refetch]);

  useEffect(() => {
    const interval = () => {
      setTimeout(() => {
        refetch();
      }, 500);
    };

    return interval();
  }, [clientName, refetch]);

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
        data={users?.data || []}
        length={users?.pagination.total}
        searchColumn="name"
        searchPlaceholder="Filtrar Clientes..."
        onFilterChange={(filters) => {
          setClientName(filters.toString());
        }}
        onPageChange={(value) => setPage(value)}
        onPageSizeChange={(value) => setPerPage(value)}
      />
    </div>
  );
}
