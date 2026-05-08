"use client";

import { Plus } from "lucide-react";

export default function QuickAddButton() {
  return (
    <button
      className="
        hidden lg:flex
        fixed bottom-8 right-8
        w-16 h-16
        rounded-full
        bg-pink-500
        text-white
        items-center justify-center
        shadow-lg
        hover:scale-105
        transition
        z-50
      "
    >
      <Plus size={28} />
    </button>
  );
}