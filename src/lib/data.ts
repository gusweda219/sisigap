import prisma from "./db";

export const getEmployees = async () => {
  const employees = await prisma.employee.findMany({
    include: {
      _count: true,
    },
  });

  return employees;
};

export const getEmployeeById = async (id: number) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id,
    },
    include: {
      _count: true,
    },
  });

  return employee;
};

export const getAllowanceTypes = async () => {
  const allowanceTypes = await prisma.allowanceType.findMany({
    include: {
      _count: true,
    },
  });

  return allowanceTypes;
};

export const getAllowanceTypeById = async (id: number) => {
  const allowanceType = await prisma.allowanceType.findUnique({
    where: {
      id,
    },
    include: {
      _count: true,
    },
  });

  return allowanceType;
};

export const getDeductionTypes = async () => {
  const deductionTypes = await prisma.deductionType.findMany({
    include: {
      _count: true,
    },
  });

  return deductionTypes;
};

export const getDeductionTypeById = async (id: number) => {
  const deductionType = await prisma.deductionType.findUnique({
    where: {
      id,
    },
    include: {
      _count: true,
    },
  });

  return deductionType;
};

export const getPayrolls = async () => {
  const payrolls = await prisma.payroll.findMany({
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

  return payrolls;
};

export const getPayrollById = async (id: number) => {
  const payroll = await prisma.payroll.findUnique({
    where: {
      id,
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

  return payroll;
};

export const getLastPayroll = async () => {
  const payroll = await prisma.payroll.findFirst({
    orderBy: [
      {
        year: "desc",
      },
      {
        month: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
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

  return payroll;
};