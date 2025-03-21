"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Pedido = {
  id: string;
  cliente: {
    nome: string;
    telefone: string;
    email: string;
  };
  data: Date;
  valor: number;
  status: string;
  endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  pagamento: {
    metodo: string;
    troco: string | null;
  };
  items: Array<{
    id: string;
    nome: string;
    quantidade: number;
    preco: number;
  }>;
  observacoes: string;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "aguardando":
      return (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
        >
          Aguardando
        </Badge>
      );
    case "em_preparo":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        >
          Em preparo
        </Badge>
      );
    case "em_entrega":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        >
          Em entrega
        </Badge>
      );
    case "entregue":
      return (
        <Badge
          variant="outline"
          className="bg-purple-100 text-[#73067D]/80 dark:bg-purple-900 dark:text-purple-300"
        >
          Entregue
        </Badge>
      );
    case "cancelado":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
        >
          Cancelado
        </Badge>
      );
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getMetodoPagamento = (metodo: string) => {
  switch (metodo) {
    case "dinheiro":
      return "Dinheiro";
    case "cartao":
      return "Cartão";
    case "pix":
      return "PIX";
    default:
      return "Desconhecido";
  }
};

export const columns: ColumnDef<Pedido>[] = [
  {
    accessorKey: "id",
    header: "Pedido",
    cell: ({ row }) => {
      return <span className="font-medium">#{row.getValue("id")}</span>;
    },
  },
  {
    accessorKey: "cliente.nome",
    header: "Cliente",
  },
  {
    accessorKey: "cliente.telefone",
    header: "Telefone",
  },
  {
    accessorKey: "data",
    header: "Data",
    cell: ({ row }) => {
      const data = row.getValue("data") as Date;
      return new Date(data).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "valor",
    header: "Valor",
    cell: ({ row }) => {
      const valor = Number.parseFloat(row.getValue("valor"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      return formatted;
    },
  },
  {
    accessorKey: "pagamento.metodo",
    header: "Pagamento",
    cell: ({ row }) => {
      const metodo = row.getValue("pagamento.metodo") as string;
      return getMetodoPagamento(metodo);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return getStatusBadge(status);
    },
  },
];
