import { DeductionTypeForm } from "@/components/DeductionTypeForm";
import { Wrapper } from "@/components/Wrapper";

const AddDeductionType = () => {
  return (
    <Wrapper>
      <DeductionTypeForm mode="create" />
    </Wrapper>
  );
};

export default AddDeductionType;
