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
import { Employee } from "@/lib/definitions";
import { createEmployee, updateEmployee } from "@/lib/actions";
import { employeeFormSchema } from "@/lib/schemas";

type EmployeeFormProps =
  | {
      mode: "create";
      employee?: Employee;
    }
  | {
      mode: "edit";
      employee: Employee;
    }
  | {
      mode: "view";
      employee: Employee;
    };

export const EmployeeForm = ({ mode, employee }: EmployeeFormProps) => {
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employeeIdNumber: employee?.employeeIdNumber ?? "",
      name: employee?.name ?? "",
      email: employee?.email ?? "",
      backAccountNumber: employee?.backAccountNumber ?? "",
      basicSalary: employee?.basicSalary,
      basicSalaryCode: employee?.basicSalaryCode ?? "",
      status: employee?.status ?? "ACTIVE",
    },
  });

  const onSubmit = async (values: z.infer<typeof employeeFormSchema>) => {
    try {
      if (mode === "create") {
        await createEmployee(values);
        toast.success("Tambah berhasil dilakukan.");
      } else if (mode === "edit") {
        await updateEmployee(employee.id, values);
        toast.success("Edit berhasil dilakukan.");
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
          name="employeeIdNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIP</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan NIP"
                  {...field}
                  disabled={mode === "view"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan Nama"
                  {...field}
                  disabled={mode === "view"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan Email"
                  type="email"
                  {...field}
                  disabled={mode === "view"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basicSalary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gaji Pokok</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan Gaji Pokok"
                  type="number"
                  {...field}
                  disabled={mode === "view"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basicSalaryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Gapok</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan Kode Gapok"
                  {...field}
                  disabled={mode === "view"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="backAccountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. Rekening</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan No. Rekening"
                  {...field}
                  disabled={mode === "view"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
