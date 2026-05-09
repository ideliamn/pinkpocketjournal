"use client";

import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function DesktopQuickAdd({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="hidden md:flex fixed bottom-8 right-8 z-40 h-16 px-7 items-center gap-3 rounded-full bg-pink-500 shadow-[0_12px_30px_rgba(236,72,153,0.35)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
    >
      <Plus className="w-6 h-6 text-white" />
      <span className="font-semibold text-white">
        Quick Add Expense
      </span>
    </button>
  );
}