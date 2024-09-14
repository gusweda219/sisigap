import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-secondary ">
      <Sidebar />
      <div className="overflow-hidden pl-[16rem]">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
