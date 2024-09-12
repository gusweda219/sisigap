"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Menu from "./Menu";
import { AlignJustifyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { logout } from "@/lib/actions";

export const Drawer = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <AlignJustifyIcon className="sm:hidden" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <Menu />
        <Button onClick={async () => await logout()} className="mt-auto">
          Logout
        </Button>
      </SheetContent>
    </Sheet>
  );
};
