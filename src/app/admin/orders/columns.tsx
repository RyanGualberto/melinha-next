"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order-status";
import { IOrder } from "@/types/order";
import { IUser } from "@/types/user";

const getStatusBadge = (status: keyof typeof OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return (
        <Badge
          variant="outline"
          className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
        >
          Aguardando Confirmação
        </Badge>
      );
    case OrderStatus.IN_PROGRESS:
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        >
          Em preparo
        </Badge>
      );
    case OrderStatus.DELIVERY_IN_PROGRESS:
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        >
          Em entrega
        </Badge>
      );
    case OrderStatus.COMPLETED:
      return (
        <Badge
          variant="outline"
          className="bg-purple-100 text-[#73067D]/80 dark:bg-purple-900 dark:text-purple-300"
        >
          Entregue
        </Badge>
      );
    case OrderStatus.CANCELED:
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
    case "money":
      return "Dinheiro";
    case "card":
      return "Cartão";
    case "pix":
      return "PIX";
    default:
      return "Desconhecido";
  }
};

export const columns: ColumnDef<IOrder>[] = [
  {
    accessorKey: "userSnapshot",
    header: "Cliente",
    cell: ({ row }) => {
      const user: IUser = JSON.parse(row.getValue("userSnapshot"));
      return user.firstName + " " + user.lastName;
    },
  },
  {
    accessorKey: "userSnapshotPhone",
    header: "Telefone",
    cell: ({ row }) => {
      const user: IUser = JSON.parse(row.getValue("userSnapshot"));
      return user.phoneNumber;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }) => {
      const data = row.getValue("createdAt") as Date;
      return new Date(data).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "deliveryCost",
    header: "Taxa de entrega",
    cell: ({ row }) => {
      const valor = Number.parseFloat(row.getValue("deliveryCost"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      return Boolean(valor) ? formatted : "Retirada";
    },
  },
  {
    accessorKey: "total",
    header: "Valor",
    cell: ({ row }) => {
      const valor = Number.parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
      return formatted;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Pagamento",
    cell: ({ row }) => {
      const metodo = row.getValue("paymentMethod") as string;
      return getMetodoPagamento(metodo);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof OrderStatus;
      return getStatusBadge(status);
    },
  },
];
