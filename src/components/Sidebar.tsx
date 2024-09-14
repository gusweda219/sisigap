"use client";

import React from "react";
import { Button } from "./ui/button";
import { logout } from "@/lib/actions";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Menu from "./Menu";

export const Sidebar = () => {
  return (
    <aside className="fixed h-screen overflow-y-auto hidden sm:flex w-[16rem] flex-col rounded-xl bg-white p-4">
      <div className="flex items-center gap-4 my-4">
        <Image src="/images/logo.png" alt="logo" width={40} height={40} />
        <h5 className="text-xl font-semibold leading-tight tracking-tight">
          SI-SIGAP
        </h5>
      </div>
      <Separator />
      <Menu />
      <Button onClick={async () => await logout()} className="mt-auto">
        Logout
      </Button>
    </aside>
  );
};
