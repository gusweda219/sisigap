"use client";

import { AllowanceType, DeductionType, Employee } from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { formatToRupiah } from "@/lib/utils";

export type MyType = {
  employee: Employee;
  basicSalary: number;
  allowances: {
    allowanceType: AllowanceType;
    amount: number;
  }[];
  centralDeductions: {
    deductionType: DeductionType;
    amount: number;
  }[];
  notCentralDeductions: {
    deductionType: DeductionType;
    amount: number;
  }[];
};

export const columns = ({
  allowanceTypes,
  centralDeductionTypes,
  notCentralDeductionTypes,
  viewOnly,
}: {
  allowanceTypes: AllowanceType[];
  centralDeductionTypes: DeductionType[];
  notCentralDeductionTypes: DeductionType[];
  viewOnly?: boolean;
}): ColumnDef<MyType>[] => [
  {
    id: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row, table }) => (
      <div className="text-center">
        {(table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1}
      </div>
    ),
    enableColumnFilter: false,
    size: 40,
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
    id: "basicSalary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gaji Pokok" />
    ),
    cell: ({ row }) => formatToRupiah(row.original.basicSalary),
  },
  ...centralDeductionTypes.map<ColumnDef<MyType>>((deductionType) => {
    const { typeName } = deductionType;

    return {
      id: typeName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={typeName} />
      ),
      cell: function ({ row, column, table }) {
        const value =
          row.original.centralDeductions.find(
            (centralDeduction) =>
              centralDeduction.deductionType.id === deductionType.id
          )?.amount ?? 0;

        return (
          <InputTable
            type="number"
            min={0}
            value={value}
            onBlur={(e) => {
              table.options.meta?.updateData?.(
                row.index,
                "centralDeductions",
                row.original.centralDeductions.map((centralDeduction) => {
                  if (centralDeduction.deductionType.id === deductionType.id) {
                    return {
                      ...centralDeduction,
                      amount: Number(e.target.value),
                    };
                  }
                  return centralDeduction;
                })
              );
            }}
            disabled={viewOnly}
          />
        );
      },
    };
  }),
  ...allowanceTypes.map<ColumnDef<MyType>>((allowanceType) => {
    const { typeName } = allowanceType;

    return {
      id: typeName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={typeName} />
      ),
      cell: function ({ row, column, table }) {
        const value =
          row.original.allowances.find(
            (allowance) => allowance.allowanceType.id === allowanceType.id
          )?.amount ?? 0;

        return (
          <InputTable
            type="number"
            min={0}
            value={value}
            onBlur={(e) => {
              table.options.meta?.updateData?.(
                row.index,
                "allowances",
                row.original.allowances.map((allowance, j) => {
                  if (allowance.allowanceType.id === allowanceType.id) {
                    return {
                      ...allowance,
                      amount: Number(e.target.value),
                    };
                  }
                  return allowance;
                })
              );
            }}
            disabled={viewOnly}
          />
        );
      },
    };
  }),
  {
    id: "adjustedBasicSalary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gaji Bersih" />
    ),
    cell: ({ row }) =>
      formatToRupiah(
        row.original.basicSalary -
          row.original.centralDeductions.reduce(
            (acc, curr) => acc + curr.amount,
            0
          ) +
          row.original.allowances.reduce((acc, curr) => acc + curr.amount, 0)
      ),
  },
  ...notCentralDeductionTypes.map<ColumnDef<MyType>>((deductionType) => {
    const { typeName } = deductionType;

    return {
      id: typeName,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={typeName} />
      ),
      cell: function ({ row, column, table }) {
        const value =
          row.original.notCentralDeductions.find(
            (notCentralDeduction) =>
              notCentralDeduction.deductionType.id === deductionType.id
          )?.amount ?? 0;

        return (
          <InputTable
            type="number"
            min={0}
            value={value}
            onBlur={(e) => {
              table.options.meta?.updateData?.(
                row.index,
                "notCentralDeductions",
                row.original.notCentralDeductions.map((notCentraldeduction) => {
                  if (
                    notCentraldeduction.deductionType.id === deductionType.id
                  ) {
                    return {
                      ...notCentraldeduction,
                      amount: Number(e.target.value),
                    };
                  }
                  return notCentraldeduction;
                })
              );
            }}
            disabled={viewOnly}
          />
        );
      },
    };
  }),
  {
    id: "netSalary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gaji Diterima" />
    ),
    cell: ({ row }) =>
      formatToRupiah(
        row.original.basicSalary -
          row.original.centralDeductions.reduce(
            (acc, curr) => acc + curr.amount,
            0
          ) +
          row.original.allowances.reduce((acc, curr) => acc + curr.amount, 0) -
          row.original.notCentralDeductions.reduce(
            (acc, curr) => acc + curr.amount,
            0
          )
      ),
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
      onChange={(e) => {
        e.target.focus();
        setValue(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === ",") {
          e.preventDefault();
        }

        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
};
