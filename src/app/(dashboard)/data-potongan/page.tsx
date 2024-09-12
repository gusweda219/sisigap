import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/DeductionTypeColumns";
import { Drawer } from "@/components/Drawer";
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
        <div className="flex gap-2">
          <Drawer />
          <h5 className="text-xl font-semibold">Jenis Potongan</h5>
        </div>
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
