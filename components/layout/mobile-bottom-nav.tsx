"use client";

import {
  House,
  ChartColumn,
  Plus,
  ReceiptText,
  Ellipsis,
} from "lucide-react";
import { useState } from "react";
import MobileMoreSheet from "./mobile-more-sheet";

interface Props {
  onQuickAdd: () => void;
}

export default function MobileBottomNav({
  onQuickAdd,
}: Props) {

  const [openMore, setOpenMore] =
    useState(false);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-20 bg-white/95 border-t border-pink-100 flex items-center justify-around px-2">
      <button className="flex flex-col items-center text-pink-500">
        <House className="w-5 h-5" />
        <span className="text-[11px] mt-1">
          Home
        </span>
      </button>

      <button className="flex flex-col items-center text-gray-400">
        <ChartColumn className="w-5 h-5" />
        <span className="text-[11px] mt-1">
          Stats
        </span>
      </button>

      {/* QUICK ADD */}
      <button
        onClick={onQuickAdd}
        className="-mt-8 h-16 w-16 rounded-full bg-pink-500 flex items-center justify-center shadow-[0_10px_30px_rgba(236,72,153,0.35)] transition-all duration-300 active:scale-95 cursor-pointer"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      <button className="flex flex-col items-center text-gray-400">
        <ReceiptText className="w-5 h-5" />
        <span className="text-[11px] mt-1">
          Transaction
        </span>
      </button>

      <button className="flex flex-col items-center text-gray-400" onClick={() => setOpenMore(true)}>
        <Ellipsis className="w-5 h-5" />
        <span className="text-[11px] mt-1">
          More
        </span>
      </button>

      <MobileMoreSheet
        open={openMore}
        onClose={() => setOpenMore(false)}
      />
    </div>
  );
}