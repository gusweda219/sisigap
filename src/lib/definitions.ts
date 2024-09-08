import { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
}>;

export type Employee = Prisma.EmployeeGetPayload<{}>;

export type AllowanceType = Prisma.AllowanceTypeGetPayload<{}>;

export type DeductionType = Prisma.DeductionTypeGetPayload<{}>;

export type Payroll = Prisma.PayrollGetPayload<{
  include: {
    payrollItems: {
      include: {
        employee: true;
        deductions: {
          include: {
            deductionType: true;
          };
        };
        allowances: {
          include: {
            allowanceType: true;
          };
        };
      };
    };
  };
}>;
