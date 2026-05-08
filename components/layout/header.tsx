"use client";

import {
  Bell,
  UserCircle2,
} from "lucide-react";

export default function Header() {
  return (
    <header className="hidden lg:block sticky top-0 z-30 bg-[#fff7fb]/80 backdrop-blur border-b border-pink-100">
      <div className="h-20 px-4 lg:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Hello ✨
          </h1>

          <p className="text-sm text-gray-500">
            Let’s manage your money today 💖
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-11 h-11 rounded-2xl bg-white border border-pink-100 flex items-center justify-center hover:bg-pink-50 cursor-pointer">
            <Bell size={20} />
          </button>

          <button className="w-11 h-11 rounded-2xl bg-white border border-pink-100 flex items-center justify-center hover:bg-pink-50 cursor-pointer">
            <UserCircle2 size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}