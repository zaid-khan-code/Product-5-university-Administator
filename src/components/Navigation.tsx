"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ClipboardList,
  Users,
  UserCheck,
  Package,
  CreditCard,
  BarChart,
  Award,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Calendar", href: "/", icon: Calendar },
  { name: "Services", href: "/services", icon: ClipboardList },
  { name: "Staff", href: "/staff", icon: Users },
  { name: "Clients", href: "/clients", icon: UserCheck },
  { name: "Memberships", href: "/memberships", icon: Award },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "POS / Checkout", href: "/pos", icon: CreditCard },
  { name: "Reports", href: "/reports", icon: BarChart },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-roseGold-500/20 h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center justify-center h-20 border-b border-roseGold-500/20">
        <h1 className="text-2xl font-bold text-roseGold-500 text-center tracking-wider">
          Serenity<br/>Spa & Salon
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  isActive
                    ? "bg-roseGold-500 text-white"
                    : "text-gray-700 hover:bg-beige-200 hover:text-roseGold-600",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                )}
              >
                <Icon
                  className={clsx(
                    isActive ? "text-white" : "text-roseGold-500 group-hover:text-roseGold-600",
                    "mr-3 flex-shrink-0 h-6 w-6"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
