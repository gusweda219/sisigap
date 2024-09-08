"use client";

import { AllowanceType, DeductionType, Employee } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

export type MyType = {
  employee: Employee;
  salary: number;
  // allowances: {
  //   allowanceType: AllowanceType;
  //   amount: number;
  // }[];
  deductions: {
    deductionType: DeductionType;
    amount: number;
  }[];
};

export const columns = ({
  allowanceTypes,
  centralDeductionTypes,
  notCentralDeductionTypes,
}: {
  allowanceTypes: AllowanceType[];
  centralDeductionTypes: DeductionType[];
  notCentralDeductionTypes: DeductionType[];
}): ColumnDef<MyType>[] => [
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
    id: "employeeIdNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="NIP" />
    ),
    cell: ({ row }) => row.original.employee.employeeIdNumber,
  },
  {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => row.original.employee.name,
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gaji" />
    ),
  },
  ...centralDeductionTypes.map<ColumnDef<MyType>>((deductionType, i) => {
    const { id, typeName } = deductionType;

    return {
      id: typeName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={typeName} />
      ),
      cell: function ({ row, column, table }) {
        return (
          <InputTable
            type="number"
            min={0}
            value={row.original.deductions[i].amount}
            onBlur={(e) => {
              table.options.meta?.updateData?.(
                row.index,
                "deductions",
                row.original.deductions.map((deduction, j) => {
                  if (i === j) {
                    return {
                      ...deduction,
                      amount: Number(e.target.value),
                    };
                  }

                  return deduction;
                })
              );
            }}
          />
        );
      },
    };
  }),
  ...allowanceTypes.map<ColumnDef<MyType>>((allowanceType, i) => {
    const { id, typeName } = allowanceType;

    return {
      id: typeName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={typeName} />
      ),
      cell: function ({ row, column, table }) {
        return (
          <InputTable
            type="number"
            min={0}
            value={row.original.deductions[i].amount}
            onBlur={(e) => {
              table.options.meta?.updateData?.(
                row.index,
                "deductions",
                row.original.deductions.map((deduction, j) => {
                  if (i === j) {
                    return {
                      ...deduction,
                      amount: Number(e.target.value),
                    };
                  }

                  return deduction;
                })
              );
            }}
          />
        );
      },
    };
  }),
  {
    id: "net1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gaji Bersih" />
    ),
    cell: ({ row }) =>
      row.original.salary -
      row.original.deductions.reduce((acc, curr) => acc + curr.amount, 0),
  },
  ...notCentralDeductionTypes.map<ColumnDef<MyType>>((deductionType, i) => {
    const { id, typeName } = deductionType;

    return {
      id: typeName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={typeName} />
      ),
      cell: function ({ row, column, table }) {
        return (
          <InputTable
            type="number"
            min={0}
            value={row.original.deductions[i].amount}
            onBlur={(e) => {
              table.options.meta?.updateData?.(
                row.index,
                "deductions",
                row.original.deductions.map((deduction, j) => {
                  if (i === j) {
                    return {
                      ...deduction,
                      amount: Number(e.target.value),
                    };
                  }

                  return deduction;
                })
              );
            }}
          />
        );
      },
    };
  }),
  {
    id: "net",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gaji Diterima" />
    ),
    cell: ({ row }) =>
      row.original.salary -
      row.original.deductions.reduce((acc, curr) => acc + curr.amount, 0),
  },
];

export const InputTable = ({
  value: initialValue,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
