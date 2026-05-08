"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import QuickAddSheet from "./quick-add-sheet";

export default function FloatingAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed
          bottom-8 lg:bottom-10
          left-1/2 lg:left-auto
          lg:right-10
          -translate-x-1/2 lg:translate-x-0
          z-[80]

          w-18 h-18 lg:w-20 lg:h-20
          rounded-full

          bg-gradient-to-br
          from-pink-500
          to-rose-400

          text-white

          shadow-[0_20px_50px_rgba(236,72,153,0.35)]

          flex items-center justify-center

          hover:scale-110
          active:scale-95

          transition-all duration-300
          cursor-pointer
        "
      >
        <Plus size={32} />
      </button>

      <QuickAddSheet
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}