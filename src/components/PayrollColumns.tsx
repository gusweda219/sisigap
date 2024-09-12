"use client";

import { DeductionType, Payroll } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { ActionButtonsWrapper } from "./ActionButtonsWrapper";
import { months } from "@/lib/constants";
import {
  EditActionButton,
  RemoveActionButton,
  SendEmailActionButton,
  ViewActionButton,
} from "./Buttons";
import { deleteDeductionType, deletePayroll, sendEmail } from "@/lib/actions";
import { toast } from "sonner";

export const columns: ColumnDef<Payroll>[] = [
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
    id: "period",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Periode" />
    ),
    cell: ({ row }) => `${months[row.original.month]} ${row.original.year}`,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      return (
        <ActionButtonsWrapper>
          <ViewActionButton href={`/slip-gaji/${row.original.id}`} />
          <EditActionButton href={`/slip-gaji/${row.original.id}/edit`} />
          <SendEmailActionButton
            onSend={async () => {
              const { error } = (await sendEmail(row.original.id)) || {};
              if (!error) {
                toast.success("Kirim email berhasil dilakukan.");
              } else {
                toast.error(error);
              }
            }}
          />
          <RemoveActionButton onRemove={() => deletePayroll(row.original.id)} />
        </ActionButtonsWrapper>
      );
    },
    enableColumnFilter: false,
  },
];
