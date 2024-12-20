"use client";

import { Employee } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { ActionButtonsWrapper } from "./ActionButtonsWrapper";
import {
  EditActionButton,
  RemoveActionButton,
  ViewActionButton,
} from "./Buttons";
import { deleteEmployee } from "@/lib/actions";
import { Badge } from "./ui/badge";

export const columns: ColumnDef<Employee>[] = [
  {
    id: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    enableColumnFilter: false,
  },
  {
    accessorKey: "employeeIdNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIP" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "backAccountNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No. Rekening" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "ACTIVE" ? "default" : "destructive"}
      >
        {row.original.status.toLowerCase()}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionButtonsWrapper>
          <ViewActionButton href={`/data-pegawai/${row.original.id}`} />
          <EditActionButton href={`/data-pegawai/${row.original.id}/edit`} />
          {!row.original._count.payrollItems && (
            <RemoveActionButton
              onRemove={() => deleteEmployee(row.original.id)}
            />
          )}
        </ActionButtonsWrapper>
      );
    },
    enableColumnFilter: false,
  },
];
