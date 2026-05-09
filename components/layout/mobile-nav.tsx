"use client";

import { usePathname, useRouter } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Expense", path: "/expenses", icon: "💸" },
    { name: "Income", path: "/incomes", icon: "💰" },
    { name: "Bills", path: "/bills", icon: "🧾" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 md:hidden">
      {menus.map((menu) => {
        const active = pathname === menu.path;

        return (
          <button
            key={menu.path}
            onClick={() => router.push(menu.path)}
            className={`flex flex-col items-center text-xs ${active ? "text-pink-500" : "text-gray-400"}`}
          >
            <span>{menu.icon}</span>
            {menu.name}
          </button>
        );
      })}
    </div>
  );
}