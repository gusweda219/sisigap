import { PayrollForm } from "@/components/PayrollForm";
import { Wrapper } from "@/components/Wrapper";
import {
  getAllowanceTypes,
  getDeductionTypes,
  getEmployees,
  getLastPayroll,
} from "@/lib/data";

const AddPayrollPage = async () => {
  const [employees, allowanceTypes, deductionTypes, lastPayroll] =
    await Promise.all([
      getEmployees({ status: "ACTIVE" }),
      getAllowanceTypes(),
      getDeductionTypes(),
      getLastPayroll(),
    ]);

  return (
    <Wrapper>
      <PayrollForm
        mode="create"
        employees={employees}
        allowanceTypes={allowanceTypes}
        deductionTypes={deductionTypes}
        payroll={lastPayroll}
      />
    </Wrapper>
  );
};

export default AddPayrollPage;
