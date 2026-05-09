"use client";

import {
  X,
  Wallet,
  Landmark,
  Receipt,
} from "lucide-react";

export default function QuickAddSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  const menus = [
    {
      label: "Add Expense",
      icon: Wallet,
    },
    {
      label: "Add Income",
      icon: Landmark,
    },
    {
      label: "Add Bill",
      icon: Receipt,
    },
  ];

  return (
    <>
      {/* BACKDROP */}
      <div onClick={onClose} className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm animate-in fade-in" />

      {/* SHEET */}
      <div className="fixed left-1/2 bottom-28 lg:bottom-8 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-white rounded-3xl border border-pink-100 shadow-2xl p-5 animate-in zoom-in-95 slide-in-from-bottom-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-lg">
              Quick Add ✨
            </h2>

            <p className="text-sm text-gray-500">
              What do you want to add?
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl hover:bg-pink-50 flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <button key={menu.label} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 transition cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-pink-500">
                  <Icon size={22} />
                </div>

                <div className="text-left">
                  <p className="font-semibold">
                    {menu.label}
                  </p>

                  <p className="text-sm text-gray-500">
                    Add new transaction
                  </p>
                </div>
              </button>
            );
          })} 
        </div>
      </div>
    </>
  );
}