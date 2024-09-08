import { PayrollForm } from "@/components/PayrollForm";
import { Wrapper } from "@/components/Wrapper";
import { getAllowanceTypes, getDeductionTypes, getEmployees } from "@/lib/data";

const AddPayrollPage = async () => {
  const [employees, allowanceTypes, deductionTypes] = await Promise.all([
    getEmployees(),
    getAllowanceTypes(),
    getDeductionTypes(),
  ]);

  return (
    <Wrapper>
      <PayrollForm
        mode="create"
        employees={employees}
        allowanceTypes={allowanceTypes}
        deductionTypes={deductionTypes}
      />
    </Wrapper>
  );
};

export default AddPayrollPage;
