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
import { DeductionType } from "@/lib/definitions";
import { createDeductionType, updateDeductionType } from "@/lib/actions";
import { deductionTypeFormSchema } from "@/lib/schemas";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type DeductionTypeFormProps =
  | {
      mode: "create";
      deductionType?: DeductionType;
    }
  | {
      mode: "edit";
      deductionType: DeductionType;
    }
  | {
      mode: "view";
      deductionType: DeductionType;
    };

export const DeductionTypeForm = ({
  mode,
  deductionType,
}: DeductionTypeFormProps) => {
  const form = useForm<z.infer<typeof deductionTypeFormSchema>>({
    resolver: zodResolver(deductionTypeFormSchema),
    defaultValues: {
      typeName: deductionType?.typeName ?? "",
      isCentral: deductionType?.isCentral ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof deductionTypeFormSchema>) => {
    try {
      if (mode === "create") {
        await createDeductionType(values);
        toast.success("Tambah berhasil dilakukan.");
      } else if (mode === "edit") {
        await updateDeductionType(deductionType.id, values);
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

        <FormField
          control={form.control}
          name="isCentral"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apakah dari potongan dari pusat?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) =>
                    form.setValue("isCentral", value === "yes")
                  }
                  defaultValue={field.value ? "yes" : "no"}
                  disabled={mode === "view"}
                  className="flex flex-col"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Ya</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">Tidak</FormLabel>
                  </FormItem>
                </RadioGroup>
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
