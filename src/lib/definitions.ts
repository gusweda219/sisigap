import { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{
  omit: {
    password: true;
  };
}>;

export type Employee = Prisma.EmployeeGetPayload<{
  include: {
    _count: true;
  };
}>;

export type AllowanceType = Prisma.AllowanceTypeGetPayload<{
  include: {
    _count: true;
  };
}>;

export type DeductionType = Prisma.DeductionTypeGetPayload<{
  include: {
    _count: true;
  };
}>;

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
