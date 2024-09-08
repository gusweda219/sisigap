import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/AllowanceTypeColumns";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/Wrapper";
import { getAllowanceTypes } from "@/lib/data";
import { Plus } from "lucide-react";
import Link from "next/link";

const AllowanceTypePage = async () => {
  const allowanceTypes = await getAllowanceTypes();

  return (
    <div className="space-y-4">
      <Wrapper className="flex items-center justify-between">
        <h5 className="text-xl font-semibold">Jenis Tunjangan</h5>
        <Link href="/data-tunjangan/tambah">
          <Button size="icon">
            <Plus />
          </Button>
        </Link>
      </Wrapper>
      <Wrapper>
        <DataTable columns={columns} data={allowanceTypes} />
      </Wrapper>
    </div>
  );
};

export default AllowanceTypePage;
