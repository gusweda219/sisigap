import { AllowanceTypeForm } from "@/components/AllowanceTypeForm";
import { Wrapper } from "@/components/Wrapper";
import { getAllowanceTypeById } from "@/lib/data";
import { notFound } from "next/navigation";

const ViewAllowanceType = async ({ params }: { params: { id: string } }) => {
  const allowanceType = await getAllowanceTypeById(+params.id);

  if (!allowanceType) {
    return notFound();
  }

  return (
    <Wrapper>
      <AllowanceTypeForm mode="view" allowanceType={allowanceType} />
    </Wrapper>
  );
};

export default ViewAllowanceType;
