"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({
  open,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="
              fixed inset-0
              bg-black/30
              backdrop-blur-sm
              z-50
            "
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              type: "spring",
              damping: 24,
              stiffness: 260,
            }}
            className="
              fixed
              left-1/2
              top-1/2
              -translate-x-1/2
              -translate-y-1/2
              z-[60]

              w-[92%]
              max-w-lg

              rounded-3xl
              bg-white
              shadow-2xl
              p-6
            "
          >
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-zinc-800">
                Add Expense ✨
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Catat pengeluaranmu sekarang
              </p>
            </div>

            {/* Placeholder form */}
            <div className="space-y-4">
              <div className="h-12 rounded-2xl bg-zinc-100 animate-pulse" />
              <div className="h-12 rounded-2xl bg-zinc-100 animate-pulse" />
              <div className="h-12 rounded-2xl bg-zinc-100 animate-pulse" />
              <div className="h-28 rounded-2xl bg-zinc-100 animate-pulse" />
            </div>

            <button
              onClick={onClose}
              className="
                mt-6
                w-full
                h-12
                rounded-2xl
                bg-pink-500
                hover:bg-pink-600
                text-white
                font-semibold
                transition
                cursor-pointer
              "
            >
              Tutup
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}