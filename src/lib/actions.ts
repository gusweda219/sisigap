"use server";

import { signIn, signOut } from "@/auth";
import {
  allowanceTypeFormSchema,
  deductionTypeFormSchema,
  employeeFormSchema,
  loginFormSchema,
  payrollFormSchema,
} from "./schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { redirect } from "next/navigation";
import prisma from "./db";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { months } from "./constants";
import { formatToRupiah } from "./utils";

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
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    if (!employee)
      return {
        error: "Pegawai tidak ditemukan.",
      };

    await prisma.$transaction(async (tx) => {
      await tx.employee.update({
        where: {
          id,
        },
        data: {
          ...values,
        },
      });

      if (employee.basicSalary !== values.basicSalary) {
        const payrollItems = await tx.payrollItem.findMany({
          where: {
            payroll: {
              shipmentStatus: "NOT_SENT",
            },
            employeeId: id,
          },
        });

        for (let payrollItem of payrollItems) {
          const basicSalary = values.basicSalary;

          const adjustedBasicSalary =
            basicSalary -
            payrollItem.centralDeductionAmount +
            payrollItem.allowanceAmount;
          const netSalary =
            adjustedBasicSalary - payrollItem.notCentralDeductionAmount;

          await tx.payrollItem.update({
            where: {
              id: payrollItem.id,
            },
            data: {
              basicSalary,
              adjustedBasicSalary,
              netSalary,
            },
          });
        }
      }
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

export const createPayroll = async (
  values: z.infer<typeof payrollFormSchema>
) => {
  try {
    const employees = await prisma.employee.findMany({
      where: {
        id: {
          in: values.payrollItems.map((payrollItem) => payrollItem.employeeId),
        },
      },
    });

    if (employees.length !== values.payrollItems.length) {
      return {
        error: "Data pegawai tidak sama.",
      };
    }

    await prisma.payroll.create({
      data: {
        month: values.month,
        year: values.year,
        payrollItems: {
          create: values.payrollItems.map((payrollItem) => {
            const basicSalary =
              employees.find(
                (employee) => employee.id === payrollItem.employeeId
              )?.basicSalary ?? 0;
            const allowanceAmount = payrollItem.allowances.reduce(
              (acc, curr) => acc + curr.amount,
              0
            );
            const centralDeductionAmount = payrollItem.centralDeductions.reduce(
              (acc, curr) => acc + curr.amount,
              0
            );
            const notCentralDeductionAmount =
              payrollItem.notCentralDeductions.reduce(
                (acc, curr) => acc + curr.amount,
                0
              );
            const deductionAmount =
              centralDeductionAmount + notCentralDeductionAmount;
            const adjustedBasicSalary =
              basicSalary - centralDeductionAmount + allowanceAmount;
            const netSalary = adjustedBasicSalary - notCentralDeductionAmount;

            return {
              basicSalary,
              adjustedBasicSalary,
              netSalary,
              allowanceAmount,
              centralDeductionAmount,
              notCentralDeductionAmount,
              deductionAmount,
              employee: {
                connect: {
                  id: payrollItem.employeeId,
                },
              },
              allowances: {
                create: payrollItem.allowances.map((allowance) => ({
                  allowanceType: {
                    connect: {
                      id: allowance.allowanceTypeId,
                    },
                  },
                  amount: allowance.amount,
                })),
              },
              deductions: {
                create: [
                  ...payrollItem.centralDeductions,
                  ...payrollItem.notCentralDeductions,
                ].map((deduction) => ({
                  deductionType: {
                    connect: {
                      id: deduction.deductionTypeId,
                    },
                  },
                  amount: deduction.amount,
                })),
              },
            };
          }),
        },
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/slip-gaji");
};

export const updatePayroll = async (
  id: number,
  values: z.infer<typeof payrollFormSchema>
) => {
  try {
    const payroll = await prisma.payroll.findUnique({
      where: {
        id,
      },
      include: {
        payrollItems: {
          include: {
            employee: true,
            deductions: {
              include: {
                deductionType: true,
              },
            },
            allowances: {
              include: {
                allowanceType: true,
              },
            },
          },
        },
      },
    });

    if (!payroll)
      return {
        error: "Slip gaji tidak ditemukan.",
      };

    await prisma.payroll.update({
      where: {
        id,
      },
      data: {
        month: values.month,
        year: values.year,
        payrollItems: {
          deleteMany: {},
          create: values.payrollItems.map((payrollItem) => {
            const basicSalary =
              payroll.payrollItems.find(
                (p) => p.employeeId === payrollItem.employeeId
              )?.basicSalary ?? 0;
            const allowanceAmount = payrollItem.allowances.reduce(
              (acc, curr) => acc + curr.amount,
              0
            );
            const centralDeductionAmount = payrollItem.centralDeductions.reduce(
              (acc, curr) => acc + curr.amount,
              0
            );
            const notCentralDeductionAmount =
              payrollItem.notCentralDeductions.reduce(
                (acc, curr) => acc + curr.amount,
                0
              );
            const deductionAmount =
              centralDeductionAmount + notCentralDeductionAmount;
            const adjustedBasicSalary =
              basicSalary - centralDeductionAmount + allowanceAmount;
            const netSalary = adjustedBasicSalary - notCentralDeductionAmount;

            return {
              basicSalary,
              adjustedBasicSalary,
              netSalary,
              allowanceAmount,
              centralDeductionAmount,
              notCentralDeductionAmount,
              deductionAmount,
              employee: {
                connect: {
                  id: payrollItem.employeeId,
                },
              },
              allowances: {
                create: payrollItem.allowances.map((allowance) => ({
                  allowanceType: {
                    connect: {
                      id: allowance.allowanceTypeId,
                    },
                  },
                  amount: allowance.amount,
                })),
              },
              deductions: {
                create: [
                  ...payrollItem.centralDeductions,
                  ...payrollItem.notCentralDeductions,
                ].map((deduction) => ({
                  deductionType: {
                    connect: {
                      id: deduction.deductionTypeId,
                    },
                  },
                  amount: deduction.amount,
                })),
              },
            };
          }),
        },
      },
    });
  } catch (error) {
    return {
      error: "Terjadi kesalahan.",
    };
  }

  redirect("/slip-gaji");
};

export async function deletePayroll(id: number) {
  try {
    await prisma.payroll.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      error: "Terjadi Kesalahan",
    };
  }

  revalidatePath("/slip-gaji");
}

export async function sendEmail(id: number) {
  try {
    const payroll = await prisma.payroll.findUnique({
      where: {
        id,
      },
      include: {
        payrollItems: {
          include: {
            employee: true,
            deductions: {
              include: {
                deductionType: true,
              },
            },
            allowances: {
              include: {
                allowanceType: true,
              },
            },
          },
        },
      },
    });

    if (!payroll) {
      return {
        error: "Slip gaji tidak ditemukan.",
      };
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    for (let payrollItem of payroll.payrollItems) {
      transporter.sendMail({
        from: "SISIGAP <pnsemarapurasisigap9@gmail.com>",
        to: payrollItem.employee.email,
        subject: "Slip Gaji",
        html: `
          <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slip Gaji</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            margin: 0 auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }
        .header h2 {
            margin: 5px 0;
            font-size: 18px;
            color: #666;
        }
        .info {
            margin-bottom: 20px;
        }
        .info p {
            margin: 5px 0;
            font-size: 16px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f4f4f4;
            color: #333;
        }
        .total {
            font-weight: bold;
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MAHKAMAH AGUNG RI</h1>
            <h2>KANTOR PENGADILAN NEGERI SEMARAPURA</h2>
        </div>
        <div class="info">
            <p><strong>Nama Pegawai:</strong> ${payrollItem.employee.name}</p>
            <p><strong>Bulan:</strong> ${months[payroll.month]} ${
          payroll.year
        }</p>
            <p><strong>Kode Gaji Pokok:</strong> ${
              payrollItem.employee.basicSalaryCode
            }</p>
        </div>
        <table>
            <tr>
                <th>Deskripsi</th>
                <th>Jumlah</th>
            </tr>
            <!-- Gaji Pokok -->
            <tr>
                <td>Gaji Pokok</td>
                <td>${formatToRupiah(payrollItem.basicSalary)}</td>
            </tr>
            <!-- Tunjangan dari Pusat -->
            ${payrollItem.allowances
              .map(
                (allowance) => `<tr>
                <td>${allowance.allowanceType.typeName}</td>
                <td>${formatToRupiah(allowance.amount)}</td>
            </tr>`
              )
              .join("")}
            <tr>
                <td class="total">Total Tunjangan dari Pusat</td>
                <td class="total">${formatToRupiah(
                  payrollItem.allowanceAmount
                )}</td>
            </tr>
            <!-- Potongan dari Pusat -->
            ${payrollItem.deductions
              .filter((deduction) => deduction.deductionType.isCentral)
              .map(
                (deduction) => `<tr>
                <td>${deduction.deductionType.typeName}</td>
                <td>- ${formatToRupiah(deduction.amount)}</td>
            </tr>`
              )
              .join("")}
            <tr>
                <td class="total">Total Potongan dari Pusat</td>
                <td class="total">- ${formatToRupiah(
                  payrollItem.centralDeductionAmount
                )}</td>
            </tr>
            <!-- Total Gaji Bersih sebelum Potongan dari Kantor -->
            <tr>
                <td class="total">Gaji Bersih Sebelum Potongan Kantor</td>
                <td class="total">${formatToRupiah(
                  payrollItem.adjustedBasicSalary
                )}</td>
            </tr>
            <!-- Potongan dari Kantor -->
            ${payrollItem.deductions
              .filter((deduction) => !deduction.deductionType.isCentral)
              .map(
                (deduction) => `<tr>
                <td>${deduction.deductionType.typeName}</td>
                <td>- ${formatToRupiah(deduction.amount)}</td>
            </tr>`
              )
              .join("")}
            <tr>
                <td class="total">Total Potongan dari Kantor</td>
                <td class="total">- ${formatToRupiah(
                  payrollItem.notCentralDeductionAmount
                )}</td>
            </tr>
            <!-- Gaji Bersih yang Diterima -->
            <tr>
                <td class="total">Gaji Bersih yang Diterima</td>
                <td class="total">${formatToRupiah(payrollItem.netSalary)}</td>
            </tr>
        </table>
        <div class="footer">
            <p>Terima kasih atas kerja keras Anda!</p>
        </div>
    </div>
</body>
</html>
        `,
      });
    }

    await prisma.payroll.update({
      where: {
        id,
      },
      data: {
        shipmentStatus: "SENT",
      },
    });

    revalidatePath("/slip-gaji");
  } catch (error) {
    return {
      error: "Terjadi Kesalahan",
    };
  }
}
