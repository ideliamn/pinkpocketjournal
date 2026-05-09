"use client";

import {
  House,
  ChartColumn,
  Plus,
  ReceiptText,
  Ellipsis,
} from "lucide-react";

interface Props {
  onQuickAdd: () => void;
}

export default function MobileBottomNav({
  onQuickAdd,
}: Props) {
  return (
    <div
      className="
        md:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50

        h-20
        bg-white/95
        backdrop-blur-xl

        border-t
        border-pink-100

        flex
        items-center
        justify-around

        px-2
      "
    >
      {/* DASHBOARD */}
      <button className="flex flex-col items-center text-pink-500">
        <House className="w-5 h-5" />
        <span className="text-[11px] mt-1">
          Home
        </span>
      </button>

      {/* STATS */}
      <button className="flex flex-col items-center text-gray-400">
        <ChartColumn className="w-5 h-5" />
        <span className="text-[11px] mt-1">
          Stats
        </span>
      </button>

      {/* QUICK ADD */}
      <button
        onClick={onQuickAdd}
        className="
          -mt-8

          h-16
          w-16

          rounded-full
          bg-pink-500

          flex
          items-center
          justify-center

          shadow-[0_10px_30px_rgba(236,72,153,0.35)]

          transition-all
          duration-300

          active:scale-95
        "
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* TRANSACTION */}
      <button className="flex flex-col items-center text-gray-400">
        <ReceiptText className="w-5 h-5" />
        <span className="text-[11px] mt-1">
          Transaction
        </span>
      </button>

      {/* MORE */}
      <button className="flex flex-col items-center text-gray-400">
        <Ellipsis className="w-5 h-5" />
        <span className="text-[11px] mt-1">
          More
        </span>
      </button>
    </div>
  );
}