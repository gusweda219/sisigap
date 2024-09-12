import { PayrollForm } from "@/components/PayrollForm";
import { Wrapper } from "@/components/Wrapper";
import {
  getAllowanceTypes,
  getDeductionTypes,
  getPayrollById,
} from "@/lib/data";
import { notFound } from "next/navigation";

const EditPayroll = async ({ params }: { params: { id: string } }) => {
  const [payroll, allowanceTypes, deductionTypes] = await Promise.all([
    getPayrollById(+params.id),
    getAllowanceTypes(),
    getDeductionTypes(),
  ]);

  if (!payroll) {
    return notFound();
  }

  return (
    <Wrapper>
      <PayrollForm
        mode="edit"
        payroll={payroll}
        allowanceTypes={allowanceTypes}
        deductionTypes={deductionTypes}
      />
    </Wrapper>
  );
};

export default EditPayroll;