import { DataTable } from "@/components/DataTable";
import { columns } from "@/components/EmployeeColumns";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/Wrapper";
import { getEmployees } from "@/lib/data";

import { Plus } from "lucide-react";
import Link from "next/link";

const EmployeePage = async () => {
  const employees = await getEmployees();

  return (
    <div className="space-y-4">
      <Wrapper className="flex items-center justify-between">
        <h5 className="text-xl font-semibold">Pegawai</h5>
        <Link href="/data-pegawai/tambah">
          <Button size="icon">
            <Plus />
          </Button>
        </Link>
      </Wrapper>
      <Wrapper>
        <DataTable columns={columns} data={employees} />
      </Wrapper>
    </div>
  );
};

export default EmployeePage;
