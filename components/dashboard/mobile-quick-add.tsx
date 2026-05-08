"use client";

import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function MobileQuickAdd({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        md:hidden

        fixed
        bottom-24
        right-5
        z-40

        h-16
        w-16

        flex
        items-center
        justify-center

        rounded-full
        bg-pink-500

        shadow-[0_12px_30px_rgba(236,72,153,0.35)]

        transition-all
        duration-300

        hover:scale-105
        active:scale-95

        cursor-pointer
        "
    >
      <Plus className="w-7 h-7 text-white" />
    </button>
  );
}