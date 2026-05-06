"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const [menus, setMenus] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((res) => setMenus(res.data || []));
  }, []);

  return (
    <aside
      className={`bg-white border-r transition-all duration-300 hidden md:flex flex-col ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* LOGO */}
      <div className="p-4 font-bold text-pink-500 flex justify-between items-center">
        {!collapsed && "pinkpocket"}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xs cursor-pointer"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      {/* MENU */}
      <div className="flex-1 px-2 space-y-1">
        {menus.map((menu) => {
          const active = pathname === menu.path;

          return (
            <button
              key={menu.id}
              onClick={() => router.push(menu.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer
                ${
                  active
                    ? "bg-pink-100 text-pink-600"
                    : "text-gray-600 hover:bg-pink-50"
                }`}
            >
              <span>📌</span>
              {!collapsed && <span>{menu.name}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}