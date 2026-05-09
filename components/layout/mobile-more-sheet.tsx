"use client";

import Link from "next/link";

import {
  Wallet,
  Receipt,
  Target,
  Tags,
  Landmark,
  Settings,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const menus = [
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

export default function MobileMoreSheet({
  open,
  onClose,
}: Props) {
  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[999] bg-black/20 transition-all duration-300 ease-out ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* SHEET */}
      <div
        className={`fixed bottom-24 right-4 z-[1000] w-[220px] rounded-3xl border border-pink-100 bg-white/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-2 transition-all duration-300 ease-out ${open ? `opacity-100 translate-y-0 scale-100` : `opacity-0 translate-y-5 scale-95 pointer-events-none`}`}
      >
        <div className="space-y-1"> {menus.map((menu) => {
          const Icon = menu.icon;
          return (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-500 active:scale-[0.98] transition-all duration-200"
            >
              <Icon size={18} />
              <span>{menu.label}</span>
            </Link>
          );
        })}
        </div>
      </div>
    </>
  );
}