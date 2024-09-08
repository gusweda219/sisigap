import prisma from "./db";

export const getEmployees = async () => {
  const employees = await prisma.employee.findMany();

  return employees;
};

export const getEmployeeById = async (id: number) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
  });

  return employee;
};

export const getAllowanceTypes = async () => {
  const allowanceTypes = await prisma.allowanceType.findMany();

  return allowanceTypes;
};

export const getAllowanceTypeById = async (id: number) => {
  const allowanceType = await prisma.allowanceType.findUnique({
    where: {
      id,
    },
  });

  return allowanceType;
};

export const getDeductionTypes = async () => {
  const deductionTypes = await prisma.deductionType.findMany();

  return deductionTypes;
};

export const getDeductionTypeById = async (id: number) => {
  const deductionType = await prisma.deductionType.findUnique({
    where: {
      id,
    },
  });

  return deductionType;
};

export const getPayrolls = async () => {
  const payrolls = await prisma.payroll.findMany({
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

  return payrolls;
};
