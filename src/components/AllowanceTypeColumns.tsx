"use client";

import { AllowanceType } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { ActionButtonsWrapper } from "./ActionButtonsWrapper";
import {
  EditActionButton,
  RemoveActionButton,
  ViewActionButton,
} from "./Buttons";
import { deleteAllowanceType, deleteDeductionType } from "@/lib/actions";

export const columns: ColumnDef<AllowanceType>[] = [
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
    accessorKey: "typeName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Jenis" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionButtonsWrapper>
          <ViewActionButton href={`/data-tunjangan/${row.original.id}`} />
          <EditActionButton href={`/data-tunjangan/${row.original.id}/edit`} />
          {!row.original._count.allowances && (
            <RemoveActionButton
              onRemove={() => deleteAllowanceType(row.original.id)}
            />
          )}
        </ActionButtonsWrapper>
      );
    },
    enableColumnFilter: false,
  },
];
