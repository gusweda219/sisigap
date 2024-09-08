"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  editable?: boolean;
  onChange?: (data: TData[]) => void;
}

export function DataTableForm<TData, TValue>({
  columns,
  data,
  onChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const newData = data.map((row, index) => {
          if (index === rowIndex) {
            console.log(index, columnId, value);
            return {
              ...data[rowIndex]!,
              [columnId]: value,
            };
          }

          return row;
        });

        console.log(newData);
        onChange?.(newData);
      },
      removeRow(rowIndex) {
        const newData = data.filter((row, index) => index !== rowIndex);

        onChange?.(newData);
      },
    },
  });

  return (
    <Table className="border">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className="border">
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
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const hasMeta = cell.getContext().cell.column.columnDef.meta;
                return (
                  <TableCell
                    key={cell.id}
                    {...(hasMeta && {
                      ...hasMeta.getCellContext(cell.getContext()),
                    })}
                    className="border"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
