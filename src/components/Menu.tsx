"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, HandCoins, Scissors, Users } from "lucide-react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <Users size={14} />,
        label: "Data Pegawai",
        href: "/data-pegawai",
      },
      {
        icon: <HandCoins size={14} />,
        label: "Data Tunjangan",
        href: "/data-tunjangan",
      },
      {
        icon: <Scissors size={14} />,
        label: "Data Potongan",
        href: "/data-potongan",
      },
      {
        icon: <DollarSign size={14} />,
        label: "Slip Gaji",
        href: "/slip-gaji",
      },
    ],
  },
];

const Menu = () => {
  const pathname = usePathname();

  return (
    <div className="text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-muted-foreground font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            return (
              <Link
                href={item.href}
                key={item.label}
                className={cn(
                  "flex items-center justify-start gap-4 text-muted-foreground py-2 px-2 rounded-md hover:bg-primary hover:text-primary-foreground",
                  pathname === item.href && "bg-primary text-primary-foreground"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
