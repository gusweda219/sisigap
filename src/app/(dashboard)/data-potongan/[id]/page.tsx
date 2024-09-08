import { DeductionTypeForm } from "@/components/DeductionTypeForm";
import { Wrapper } from "@/components/Wrapper";
import { getDeductionTypeById } from "@/lib/data";
import { notFound } from "next/navigation";

const ViewDeductionType = async ({ params }: { params: { id: string } }) => {
  const deductionType = await getDeductionTypeById(+params.id);

  if (!deductionType) {
    return notFound();
  }

  return (
    <Wrapper>
      <DeductionTypeForm mode="view" deductionType={deductionType} />
    </Wrapper>
  );
};

export default ViewDeductionType;
