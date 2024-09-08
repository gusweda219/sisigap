import { AllowanceTypeForm } from "@/components/AllowanceTypeForm";
import { Wrapper } from "@/components/Wrapper";
import { getAllowanceTypeById } from "@/lib/data";
import { notFound } from "next/navigation";

const EditAllowanceType = async ({ params }: { params: { id: string } }) => {
  const allowanceType = await getAllowanceTypeById(+params.id);

  if (!allowanceType) {
    return notFound();
  }

  return (
    <Wrapper>
      <AllowanceTypeForm mode="edit" allowanceType={allowanceType} />
    </Wrapper>
  );
};

export default EditAllowanceType;
