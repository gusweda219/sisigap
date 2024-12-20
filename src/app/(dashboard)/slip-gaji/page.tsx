import { DataTable } from "@/components/DataTable";
import { Drawer } from "@/components/Drawer";
import { columns } from "@/components/PayrollColumns";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/Wrapper";
import { getPayrolls } from "@/lib/data";
import { Plus } from "lucide-react";
import Link from "next/link";

const PayrollPage = async () => {
  const payrolls = await getPayrolls();

  return (
    <div className="space-y-4">
      <Wrapper className="flex items-center justify-between">
        <div className="flex gap-2">
          <Drawer />
          <h5 className="text-xl font-semibold">Slip Gaji</h5>
        </div>
        <Link href="/slip-gaji/tambah">
          <Button size="icon">
            <Plus />
          </Button>
        </Link>
      </Wrapper>
      <Wrapper>
        <DataTable columns={columns} data={payrolls} />
      </Wrapper>
    </div>
  );
};

export default PayrollPage;
