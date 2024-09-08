"use server";

import { signIn, signOut } from "@/auth";
import {
  allowanceTypeFormSchema,
  deductionTypeFormSchema,
  employeeFormSchema,
  loginFormSchema,
} from "./schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { redirect } from "next/navigation";
import prisma from "./db";
import { revalidatePath } from "next/cache";

export const login = async (values: z.infer<typeof loginFormSchema>) => {
  try {
    const data = await signIn("credentials", {
      ...values,
      redirectTo: "/data-pegawai",
    });
    return {
      data,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: error.cause?.err?.message,
      };
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut({ redirectTo: "/login" });
  } catch (error) {
    if (error instanceof AuthError) {
      throw error.cause?.err;
    }
    throw error;
  }
};

export const createEmployee = async (
  values: z.infer<typeof employeeFormSchema>
) => {
  try {
    await prisma.employee.create({
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/data-pegawai");
};

export const updateEmployee = async (
  id: number,
  values: z.infer<typeof employeeFormSchema>
) => {
  try {
    const user = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    if (!user)
      return {
        error: "Pegawai tidak ditemukan.",
      };

    await prisma.employee.update({
      where: {
        id,
      },
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/data-pegawai");
};

export async function deleteEmployee(id: number) {
  try {
    await prisma.employee.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi Kesalahan",
    };
  }

  revalidatePath("/data-pegawai");
}

export const createAllowanceType = async (
  values: z.infer<typeof allowanceTypeFormSchema>
) => {
  try {
    await prisma.allowanceType.create({
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/data-tunjangan");
};

export const updateAllowanceType = async (
  id: number,
  values: z.infer<typeof allowanceTypeFormSchema>
) => {
  try {
    const allowanceType = await prisma.allowanceType.findUnique({
      where: {
        id,
      },
    });

    if (!allowanceType)
      return {
        error: "Jenis tunjangan tidak ditemukan.",
      };

    await prisma.allowanceType.update({
      where: {
        id,
      },
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/data-tunjangan");
};

export async function deleteAllowanceType(id: number) {
  try {
    await prisma.allowanceType.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi Kesalahan",
    };
  }

  revalidatePath("/data-tunjangan");
}

export const createDeductionType = async (
  values: z.infer<typeof deductionTypeFormSchema>
) => {
  try {
    await prisma.deductionType.create({
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/data-potongan");
};

export const updateDeductionType = async (
  id: number,
  values: z.infer<typeof deductionTypeFormSchema>
) => {
  try {
    const deductionType = await prisma.deductionType.findUnique({
      where: {
        id,
      },
    });

    if (!deductionType)
      return {
        error: "Jenis potongan tidak ditemukan.",
      };

    await prisma.deductionType.update({
      where: {
        id,
      },
      data: {
        ...values,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/data-potongan");
};

export async function deleteDeductionType(id: number) {
  try {
    await prisma.deductionType.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi Kesalahan",
    };
  }

  revalidatePath("/data-potongan");
}
