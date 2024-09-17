"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  AllowanceType,
  DeductionType,
  Employee,
  Payroll,
} from "@/lib/definitions";
import { columns, MyType } from "./PayrollFormColumns";
import { useEffect, useMemo, useState } from "react";
import { DataTableForm } from "./DataTableForm";
import { payrollFormSchema } from "@/lib/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { months } from "@/lib/constants";
import { createPayroll, updatePayroll } from "@/lib/actions";

type PayrollFormProps =
  | {
      mode: "create";
      employees: Employee[];
      deductionTypes: DeductionType[];
      allowanceTypes: AllowanceType[];
      payroll?: Payroll | null;
    }
  | {
      mode: "edit";
      employees?: Employee[];
      deductionTypes: DeductionType[];
      allowanceTypes: AllowanceType[];
      payroll: Payroll;
    }
  | {
      mode: "view";
      employees?: Employee[];
      deductionTypes: DeductionType[];
      allowanceTypes: AllowanceType[];
      payroll: Payroll;
    };

export const PayrollForm = ({
  mode,
  employees,
  allowanceTypes,
  deductionTypes,
  payroll,
}: PayrollFormProps) => {
  const centralDeductionTypes = useMemo(
    () => deductionTypes.filter((deductionType) => deductionType.isCentral),
    [deductionTypes]
  );

  const notCentralDeductionTypes = useMemo(
    () => deductionTypes.filter((deductionType) => !deductionType.isCentral),
    [deductionTypes]
  );

  const form = useForm<z.infer<typeof payrollFormSchema>>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: {
      year: payroll?.year ?? new Date().getFullYear(),
      month: payroll?.month ?? new Date().getMonth(),
    },
  });

  const [itemTable, setItemTable] = useState<MyType[]>([]);

  useEffect(() => {
    if (mode === "create") {
      setItemTable([
        ...(payroll?.payrollItems.map((payrollItem) => ({
          employee: payrollItem.employee,
          basicSalary: payrollItem.employee.basicSalary,
          centralDeductions: deductionTypes
            .filter((deductionType) => deductionType.isCentral)
            .map((deductionType) => ({
              deductionType,
              amount:
                payrollItem.deductions.find(
                  (deduction) => deduction.deductionTypeId === deductionType.id
                )?.amount ?? 0,
            })),
          notCentralDeductions: deductionTypes
            .filter((deductionType) => !deductionType.isCentral)
            .map((deductionType) => ({
              deductionType,
              amount:
                payrollItem.deductions.find(
                  (deduction) => deduction.deductionTypeId === deductionType.id
                )?.amount ?? 0,
            })),
          allowances: allowanceTypes.map((allowanceType) => ({
            allowanceType,
            amount:
              payrollItem.allowances.find(
                (allowance) => allowance.allowanceTypeId === allowanceType.id
              )?.amount ?? 0,
          })),
        })) ?? []),
        ...employees
          .filter(
            (employee) =>
              !payroll?.payrollItems.some(
                (payrollItem) => payrollItem.employeeId === employee.id
              )
          )
          .map((employee) => ({
            employee: employee,
            basicSalary: employee.basicSalary,
            centralDeductions: deductionTypes
              .filter((deductionType) => deductionType.isCentral)
              .map((deductionType) => ({
                deductionType,
                amount: 0,
              })),
            notCentralDeductions: deductionTypes
              .filter((deductionType) => !deductionType.isCentral)
              .map((deductionType) => ({
                deductionType,
                amount: 0,
              })),
            allowances: allowanceTypes.map((allowanceType) => ({
              allowanceType,
              amount: 0,
            })),
          })),
      ]);
    } else {
      setItemTable(
        payroll.payrollItems.map((payrollItem) => ({
          employee: payrollItem.employee,
          basicSalary: payrollItem.basicSalary,
          centralDeductions: deductionTypes
            .filter((deductionType) => deductionType.isCentral)
            .map((deductionType) => ({
              deductionType,
              amount:
                payrollItem.deductions.find(
                  (deduction) => deduction.deductionTypeId === deductionType.id
                )?.amount ?? 0,
            })),
          notCentralDeductions: deductionTypes
            .filter((deductionType) => !deductionType.isCentral)
            .map((deductionType) => ({
              deductionType,
              amount:
                payrollItem.deductions.find(
                  (deduction) => deduction.deductionTypeId === deductionType.id
                )?.amount ?? 0,
            })),
          allowances: allowanceTypes.map((allowanceType) => ({
            allowanceType,
            amount:
              payrollItem.allowances.find(
                (allowance) => allowance.allowanceTypeId === allowanceType.id
              )?.amount ?? 0,
          })),
        }))
      );
    }
  }, [payroll]);

  useEffect(() => {
    form.setValue(
      "payrollItems",
      itemTable.map((e) => ({
        employeeId: e.employee.id,
        allowances: e.allowances.map((allowance) => ({
          allowanceTypeId: allowance.allowanceType.id,
          amount: allowance.amount,
        })),
        centralDeductions: e.centralDeductions.map((deduction) => ({
          deductionTypeId: deduction.deductionType.id,
          amount: deduction.amount,
        })),
        notCentralDeductions: e.notCentralDeductions.map((deduction) => ({
          deductionTypeId: deduction.deductionType.id,
          amount: deduction.amount,
        })),
      }))
    );
  }, [itemTable]);

  const onSubmit = async (values: z.infer<typeof payrollFormSchema>) => {
    try {
      if (mode === "create") {
        const { error } = (await createPayroll(values)) || {};
        if (!error) {
          toast.success("Tambah berhasil dilakukan.");
        } else {
          toast.error(error);
        }
      } else if (mode === "edit") {
        const { error } = (await updatePayroll(payroll.id, values)) || {};
        if (!error) {
          toast.success("Edit berhasil dilakukan.");
        } else {
          toast.error(error);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tahun</FormLabel>
              <Select
                onValueChange={(value) => form.setValue("year", Number(value))}
                defaultValue={`${field.value}`}
                disabled={mode === "view"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tahun" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[180px] w-[160px]">
                  {Array.from(
                    { length: 40 },
                    (_, i) => new Date().getFullYear() - 20 + i
                  ).map((year) => (
                    <SelectItem key={year} value={`${year}`}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bulan</FormLabel>
              <Select
                onValueChange={(value) => form.setValue("month", Number(value))}
                defaultValue={`${field.value}`}
                disabled={mode === "view"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[180px] w-[160px]">
                  {months.map((month, i) => (
                    <SelectItem key={i} value={`${i}`}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DataTableForm
          columns={columns({
            allowanceTypes,
            centralDeductionTypes,
            notCentralDeductionTypes,
            viewOnly: mode === "view",
          })}
          data={itemTable}
          onChange={(data) => setItemTable(data)}
        />

        {(mode === "create" || mode === "edit") && (
          <Button
            type="submit"
            className="mt-4 ml-auto"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Loading..."
              : mode === "create"
              ? "Tambah"
              : "Edit"}
          </Button>
        )}
      </form>
    </Form>
  );
};
