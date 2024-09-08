"use client";

import { DeductionType, Payroll } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { ActionButtonsWrapper } from "./ActionButtonsWrapper";
// import {
//   EditActionButton,
//   RemoveActionButton,
//   SendEmailActionButton,
//   ViewActionButton,
// } from "./Buttons";
// import { deleteDeductionType, sendEmail } from "@/lib/actions";

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
  // {
  //   id: "actions",
  //   header: () => <div className="text-right">Aksi</div>,
  //   cell: ({ row }) => {
  //     return (
  //       <ActionButtonsWrapper>
  //         <ViewActionButton href={`/data-potongan/${row.original.id}`} />
  //         <EditActionButton href={`/data-potongan/${row.original.id}/edit`} />
  //         <SendEmailActionButton onSend={() => sendEmail(row.original.id)} />
  //         <RemoveActionButton
  //           onRemove={() => deleteDeductionType(row.original.id)}
  //         />
  //       </ActionButtonsWrapper>
  //     );
  //   },
  //   enableColumnFilter: false,
  // },
];
