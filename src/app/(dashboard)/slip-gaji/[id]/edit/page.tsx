import { PayrollForm } from "@/components/PayrollForm";
import { Wrapper } from "@/components/Wrapper";
import {
  getAllowanceTypes,
  getDeductionTypes,
  getPayrollById,
} from "@/lib/data";
import { notFound, redirect } from "next/navigation";

const EditPayroll = async ({ params }: { params: { id: string } }) => {
  const [payroll, allowanceTypes, deductionTypes] = await Promise.all([
    getPayrollById(+params.id),
    getAllowanceTypes(),
    getDeductionTypes(),
  ]);

  if (!payroll) {
    return notFound();
  }

  if (payroll.status !== "NOT_SENT") {
    return redirect("/slip-gaji");
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
