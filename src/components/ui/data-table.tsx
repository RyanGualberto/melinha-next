"use client";

import React, { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  RowSelectionState,
  type SortingState,
  Updater,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  length?: number;
  searchColumn?: string;
  searchPlaceholder?: string;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFilterChange?: (filters: string) => void;
  setSelectedRows?: (selectedRows: Updater<RowSelectionState>) => void;
  selectedRows?: RowSelectionState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  length,
  searchColumn,
  searchPlaceholder = "Filtrar...",
  onPageChange,
  onPageSizeChange,
  setSelectedRows,
  selectedRows = {},
  onFilterChange,
}: DataTableProps<TData & { id: string }, TValue>) {
  const defaultPageSize = 10;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [pageIndex, setPageIndex] = useState(0);

  const table = useReactTable({
    getRowId: (row, index) => {
      return row.id ?? index.toString();
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: (filters) => {
      setColumnFilters(filters);
    },
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil((length ?? data.length) / pageSize),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
      rowSelection: selectedRows,
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;

      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
      onPageChange?.(newState.pageIndex);
      onPageSizeChange?.(newState.pageSize);
    },
    onRowSelectionChange: (d) => setSelectedRows?.(d),
  });

  return (
    <div className="space-y-4">
      {searchColumn && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn(searchColumn)?.setFilterValue(event.target.value);
              onFilterChange?.(event.target.value);
            }}
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border max-w-xs md:max-w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div>
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {Math.ceil(
              (length ?? data.length) / table.getState().pagination.pageSize
            )}
          </div>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              const pageSize = Number(value);
              table.setPageSize(pageSize);
              onPageSizeChange?.(pageSize);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 75, 100, 150, 200].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Próxima página</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
