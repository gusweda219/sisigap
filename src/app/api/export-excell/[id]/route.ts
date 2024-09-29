import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { Workbook } from "exceljs";
import { months } from "@/lib/constants";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payroll = await prisma.payroll.findUnique({
      where: {
        id: +params.id,
      },
      include: {
        payrollItems: {
          orderBy: {
            employee: {
              createdAt: "asc",
            },
          },
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
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    // Buat workbook dan worksheet menggunakan exceljs
    const workbook = new Workbook();
    const ws = workbook.addWorksheet();

    // Set width column
    ws.getColumn(1).width = 5;
    ws.getColumn(2).width = 42;
    ws.getColumn(3).width = 17;
    ws.getColumn(4).width = 13;
    ws.getColumn(5).width = 13;
    ws.getColumn(6).width = 15;

    ws.mergeCells(1, 1, 1, 6);
    ws.getCell(1, 1).value = `DATA GAJI PEGAWAI BULAN ${
      months[payroll.month]
    } ${payroll.year}`;

    ws.mergeCells(2, 1, 2, 6);
    ws.getCell(2, 1).value = "PENGADILAN NEGERI SEMARAPURA";

    ws.getCell(3, 1).value = "NO";
    ws.getCell(3, 2).value = "NAMA";
    ws.getCell(3, 3).value = "NO REKENING";
    ws.getCell(3, 4).value = "GAJI BRUTO";
    ws.getCell(3, 5).value = "POTONGAN LAIN-LAIN";
    ws.getCell(3, 6).value = "GAJI";

    payroll.payrollItems.forEach((payrollItem, i) => {
      const rowIndex = 4 + i;

      ws.getCell(rowIndex, 1).value = i + 1;
      ws.getCell(rowIndex, 2).value = payrollItem.employee.name;
      ws.getCell(rowIndex, 3).value = payrollItem.employee.backAccountNumber;
      const cellAdjustedBasicSalary = ws.getCell(rowIndex, 4);
      cellAdjustedBasicSalary.value = payrollItem.adjustedBasicSalary;
      cellAdjustedBasicSalary.numFmt = "#,##0";
      const cellNotCentralDeductionAmount = ws.getCell(rowIndex, 5);
      cellNotCentralDeductionAmount.value =
        payrollItem.notCentralDeductionAmount;
      cellNotCentralDeductionAmount.numFmt = "#,##0";
      const cellNetSalary = ws.getCell(rowIndex, 6);
      cellNetSalary.value = payrollItem.netSalary;
      cellNetSalary.numFmt = '"Rp "#,##0';
    });

    const rowTotalIndex = 4 + payroll.payrollItems.length;
    ws.getCell(rowTotalIndex, 2).value = "JUMLAH";
    const cellTotalAdjustedBasicSalary = ws.getCell(rowTotalIndex, 4);
    cellTotalAdjustedBasicSalary.value = {
      formula: `SUM(D${4}:D${4 + payroll.payrollItems.length - 1})`,
    };
    cellTotalAdjustedBasicSalary.numFmt = "#,##0";
    const cellTotalNotCentralDeductionAmount = ws.getCell(rowTotalIndex, 5);
    cellTotalNotCentralDeductionAmount.value = {
      formula: `SUM(E${4}:E${4 + payroll.payrollItems.length - 1})`,
    };
    cellTotalNotCentralDeductionAmount.numFmt = "#,##0";
    const cellTotalNetSalary = ws.getCell(rowTotalIndex, 6);
    cellTotalNetSalary.value = {
      formula: `SUM(F${4}:F${4 + payroll.payrollItems.length - 1})`,
    };
    cellTotalNetSalary.numFmt = "#,##0";

    // Style
    for (let row = 1; row <= 2; row++) {
      const cell = ws.getCell(row, 1);
      cell.font = {
        bold: true,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }

    for (let row = 3; row <= 3; row++) {
      for (let col = 1; col <= 6; col++) {
        const cell = ws.getCell(row, col);
        cell.font = {
          bold: true,
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFB8CCE4" },
        };
      }
    }

    for (let row = rowTotalIndex; row <= rowTotalIndex; row++) {
      for (let col = 1; col <= 6; col++) {
        const cell = ws.getCell(row, col);
        cell.font = {
          bold: true,
          italic: true,
        };
      }
    }

    for (let row = 3; row <= 3 + payroll.payrollItems.length + 1; row++) {
      for (let col = 1; col <= 6; col++) {
        const cell = ws.getCell(row, col);
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    }

    for (let row = 4; row <= 4 + payroll.payrollItems.length; row++) {
      const cell = ws.getCell(row, 1);
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }

    // Buat buffer dari workbook
    const buffer = await workbook.xlsx.writeBuffer();

    // Kirim buffer sebagai response
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="report.xlsx"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Export gagal." },
      {
        status: 500,
      }
    );
  }
};
