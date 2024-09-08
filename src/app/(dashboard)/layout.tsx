import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 overflow-hidden bg-secondary p-4">{children}</div>
    </div>
  );
};

export default DashboardLayout;
