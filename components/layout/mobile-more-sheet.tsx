"use client";

import {
  X,
  Wallet,
  Receipt,
  Tags,
  Landmark,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { useRouter } from "next/navigation";

const menus = [
  {
    label: "Income",
    href: "/income",
    icon: Wallet,
  },
  {
    label: "Bills",
    href: "/bills",
    icon: Receipt,
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
    label: "Insights",
    href: "/insights",
    icon: BarChart3,
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
}: any) {
  const router = useRouter();

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-[70]"
      />

      <div className="fixed bottom-0 left-0 right-0 z-[80] bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">
            More Menu ✨
          </h2>

          <button
            onClick={onClose}
            className="cursor-pointer"
          >
            <X />
          </button>
        </div>

        <div className="space-y-3">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <button
                key={menu.href}
                onClick={() => {
                  router.push(menu.href);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-pink-50 cursor-pointer"
              >
                <Icon size={20} />

                {menu.label}
              </button>
            );
          })}

          <button
            className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-500 hover:bg-red-50 cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}