"use client";

import { useState } from "react";

import Sidebar from "./sidebar";
import Header from "./header";
import MobileBottomNav from "./mobile-bottom-nav";
import MobileMoreSheet from "./mobile-more-sheet";
import AddExpenseModal from "../expense/add-expense-modal";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff7fb]">
      {/* DESKTOP SIDEBAR */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div
        className={`
          transition-all duration-300
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        <Header />

        <main className="px-4 py-5 lg:px-8 lg:py-6 pb-32 lg:pb-8 max-w-[1800px]">
          {children}
        </main>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden">
        <MobileBottomNav
          onQuickAdd={() => setOpenExpenseModal(true)}
        />

        <AddExpenseModal
          open={openExpenseModal}
          onClose={() => setOpenExpenseModal(false)}
        />
        <MobileMoreSheet
          open={moreOpen}
          onClose={() => setMoreOpen(false)}
        />
      </div>
    </div>
  );
}