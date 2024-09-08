import { DeductionTypeForm } from "@/components/DeductionTypeForm";
import { Wrapper } from "@/components/Wrapper";
import { getDeductionTypeById } from "@/lib/data";
import { notFound } from "next/navigation";

const EditDeductionType = async ({ params }: { params: { id: string } }) => {
  const deductionType = await getDeductionTypeById(+params.id);

  if (!deductionType) {
    return notFound();
  }

  return (
    <Wrapper>
      <DeductionTypeForm mode="edit" deductionType={deductionType} />
    </Wrapper>
  );
};

export default EditDeductionType;
