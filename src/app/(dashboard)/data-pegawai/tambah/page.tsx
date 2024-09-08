import { EmployeeForm } from "@/components/EmployeeForm";
import { Wrapper } from "@/components/Wrapper";

const AddEmployee = () => {
  return (
    <Wrapper>
      <EmployeeForm mode="create" />
    </Wrapper>
  );
};

export default AddEmployee;
