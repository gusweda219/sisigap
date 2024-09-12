import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong."),
  password: z.string().min(1, "Password tidak boleh kosong."),
});

export const employeeFormSchema = z.object({
  employeeIdNumber: z.string().min(1, "NIP tidak boleh kosong"),
  name: z.string().min(1, "Nama tidak boleh kosong"),
  email: z.string().email(),
  backAccountNumber: z.string().min(1, "No. Rekening tidak boleh kosong"),
  basicSalary: z.coerce
    .number({ message: "Gaji pokok tidak boleh kosong" })
    .min(1, "Harga harus lebih besar dari 0"),
  basicSalaryCode: z.string().min(1, "Kode Gapok tidak boleh kosong"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const allowanceTypeFormSchema = z.object({
  typeName: z.string().min(1, "Nama Jenis tidak boleh kosong"),
  isCentral: z.boolean().default(true),
});

export const deductionTypeFormSchema = z.object({
  typeName: z.string().min(1, "Nama Jenis tidak boleh kosong"),
  isCentral: z.boolean().default(true),
});

export const payrollFormSchema = z.object({
  month: z.number(),
  year: z.number(),
  payrollItems: z.array(
    z.object({
      employeeId: z.number(),
      centralDeductions: z.array(
        z.object({ deductionTypeId: z.number(), amount: z.number() })
      ),
      notCentralDeductions: z.array(
        z.object({ deductionTypeId: z.number(), amount: z.number() })
      ),
      allowances: z.array(
        z.object({ allowanceTypeId: z.number(), amount: z.number() })
      ),
    })
  ),
});
