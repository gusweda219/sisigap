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
import { AllowanceType } from "@/lib/definitions";
import { createAllowanceType, updateAllowanceType } from "@/lib/actions";
import { allowanceTypeFormSchema } from "@/lib/schemas";

type AllowanceTypeFormProps =
  | {
      mode: "create";
      allowanceType?: AllowanceType;
    }
  | {
      mode: "edit";
      allowanceType: AllowanceType;
    }
  | {
      mode: "view";
      allowanceType: AllowanceType;
    };

export const AllowanceTypeForm = ({
  mode,
  allowanceType,
}: AllowanceTypeFormProps) => {
  const form = useForm<z.infer<typeof allowanceTypeFormSchema>>({
    resolver: zodResolver(allowanceTypeFormSchema),
    defaultValues: {
      typeName: allowanceType?.typeName ?? "",
      isCentral: allowanceType?.isCentral ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof allowanceTypeFormSchema>) => {
    try {
      if (mode === "create") {
        await createAllowanceType(values);
        toast.success("Tambah berhasil dilakukan.");
      } else if (mode === "edit") {
        await updateAllowanceType(allowanceType.id, values);
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
          name="typeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Nama</FormLabel>
              <FormControl>
                <Input
                  placeholder="Masukkan Jenis Nama"
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
