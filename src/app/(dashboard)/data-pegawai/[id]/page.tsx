import { EmployeeForm } from "@/components/EmployeeForm";
import { Wrapper } from "@/components/Wrapper";
import { getEmployeeById } from "@/lib/data";
import { notFound } from "next/navigation";

const ViewEmployeePage = async ({ params }: { params: { id: string } }) => {
  const employee = await getEmployeeById(+params.id);

  if (!employee) {
    return notFound();
  }

  return (
    <Wrapper>
      <EmployeeForm mode="view" employee={employee} />
    </Wrapper>
  );
};

export default ViewEmployeePage;
