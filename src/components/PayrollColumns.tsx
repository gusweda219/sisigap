"use client";

import { Payroll } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { ActionButtonsWrapper } from "./ActionButtonsWrapper";
import { months } from "@/lib/constants";
import {
  EditActionButton,
  ExportExcellActionButton,
  RemoveActionButton,
  SendEmailActionButton,
  ViewActionButton,
} from "./Buttons";
import { deletePayroll, sendEmail } from "@/lib/actions";
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
          <ExportExcellActionButton
            onExport={async () => {
              const res = await fetch(`/api/export-excell/${row.original.id}`);

              if (!res.ok) {
                const { error } = (await res.json()) || {};
                toast.error(error);
                return;
              }

              const url = window.URL.createObjectURL(await res.blob());

              const a = document.createElement("a");
              a.href = url;
              a.download = `Slip-Gaji-${months[row.original.month]}-${
                row.original.year
              }-${Date.now()}.xlsx`;
              a.click();

              URL.revokeObjectURL(url);
            }}
          />
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
