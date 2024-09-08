import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/DeductionTypeColumns";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/Wrapper";
import { getDeductionTypes } from "@/lib/data";
import { Plus } from "lucide-react";
import Link from "next/link";

const DeductionTypePage = async () => {
  const deductionTypes = await getDeductionTypes();

  return (
    <div className="space-y-4">
      <Wrapper className="flex items-center justify-between">
        <h5 className="text-xl font-semibold">Jenis Potongan</h5>
        <Link href="/data-potongan/tambah">
          <Button size="icon">
            <Plus />
          </Button>
        </Link>
      </Wrapper>
      <Wrapper>
        <DataTable columns={columns} data={deductionTypes} />
      </Wrapper>
    </div>
  );
};

export default DeductionTypePage;
