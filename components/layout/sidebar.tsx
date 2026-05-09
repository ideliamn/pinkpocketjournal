"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Target,
  Tags,
  Landmark,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  collapsed: boolean;
  setCollapsed: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Expenses",
    href: "/expenses",
    icon: Wallet,
  },
  {
    label: "Bills",
    href: "/bills",
    icon: Receipt,
  },
  {
    label: "Plans",
    href: "/plans",
    icon: Target,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Tags,
  },
  {
    label: "Sources",
    href: "/sources",
    icon: Landmark,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
}: Props) {
  const pathname = usePathname();

  return (
    <aside className={`hidden lg:flex fixed left-0 top-0 z-40 h-screen bg-white border-r border-pink-100 flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"} `}>
      {/* LOGO */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-pink-100">
        {!collapsed && (
          <div>
            <h1 className="font-bold text-pink-500 text-xl">
              pink pocket
            </h1>
            <p className="text-xs text-pink-300">
              journal ✨
            </p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="w-10 h-10 rounded-xl hover:bg-pink-50 flex items-center justify-center cursor-pointer">
          {collapsed
            ? (<ChevronRight size={18} />)
            : (<ChevronLeft size={18} />)}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-3 space-y-2">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = pathname === menu.href;
          return (
            <Link key={menu.href} href={menu.href} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${active ? "bg-pink-500 text-white" : "hover:bg-pink-50 text-gray-700"}`}>
              <Icon size={20} />
              {!collapsed && (
                <span className="font-medium">
                  {menu.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}