"use client";

import {
  House,
  Wallet,
  Target,
  Menu,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function MobileBottomNav({
  onMore,
}: {
  onMore: () => void;
}) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-pink-100 h-20 flex items-center justify-around px-2">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex flex-col items-center text-xs text-gray-600 cursor-pointer"
      >
        <House size={22} />
        Dashboard
      </button>

      <button
        onClick={() => router.push("/expenses")}
        className="flex flex-col items-center text-xs text-gray-600 cursor-pointer"
      >
        <Wallet size={22} />
        Expenses
      </button>

      <div className="w-14" />

      <button
        onClick={() => router.push("/plans")}
        className="flex flex-col items-center text-xs text-gray-600 cursor-pointer"
      >
        <Target size={22} />
        Plans
      </button>

      <button
        onClick={onMore}
        className="flex flex-col items-center text-xs text-gray-600 cursor-pointer"
      >
        <Menu size={22} />
        More
      </button>
    </div>
  );
}