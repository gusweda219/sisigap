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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AllowanceType,
  DeductionType,
  Employee,
  Payroll,
} from "@/lib/definitions";
import { Label } from "./ui/label";
import { columns, MyType } from "./PayrollFormColumns";
import { useEffect, useState } from "react";
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

type PayrollFormProps =
  | {
      mode: "create";
      employees: Employee[];
      deductionTypes: DeductionType[];
      allowanceTypes: AllowanceType[];
      payroll?: Payroll;
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
      employees: Employee[];
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
  const centralDeductionTypes = deductionTypes.filter(
    (deductionType) => deductionType.isCentral
  );

  const notCentralDeductionTypes = deductionTypes.filter(
    (deductionType) => !deductionType.isCentral
  );

  const form = useForm<z.infer<typeof payrollFormSchema>>({
    resolver: zodResolver(payrollFormSchema),
    defaultValues: {
      year: payroll?.year ?? new Date().getFullYear(),
      month: payroll?.month ?? new Date().getMonth(),
    },
  });

  const [itemTable, setItemTable] = useState<MyType[]>(
    mode === "create"
      ? employees.map((employee) => ({
          employee: employee,
          salary: employee.basicSalary,
          deductions: deductionTypes.map((deductionType) => ({
            deductionType,
            amount: 0,
          })),
        }))
      : []
  );

  useEffect(() => {
    form.setValue(
      "payrollItems",
      itemTable.map((e) => ({
        employeeId: e.employee.id,
        salary: e.salary,
        deductions: e.deductions.map((e2) => ({
          deductionTypeId: e2.deductionType.id,
          amount: e2.amount,
        })),
      }))
    );
  }, [itemTable]);

  const onSubmit = async (values: z.infer<typeof payrollFormSchema>) => {
    // try {
    //   if (mode === "create") {
    //     await createPayroll(values);
    //     toast.success("Tambah berhasil dilakukan.");
    //   } else if (mode === "edit") {
    //     toast.success("Edit berhasil dilakukan.");
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     toast.error(error.message);
    //   }
    // }
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
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
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
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
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
