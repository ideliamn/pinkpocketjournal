"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import DesktopQuickAdd from "@/components/layout/desktop-quick-add";

import AddExpenseModal from "@/components/expense/add-expense-modal";
import SessionChecker from "./session-checker";

interface Props {
  children: React.ReactNode;
}

export default function AppShell({
  children,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user/me");
      const result = await res.json();

      if (res.ok && result.code === 1) {
        setUser(result.data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7fb]">
      <SessionChecker />

      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN */}
      <div className={`transition-all duration-300 ${collapsed ? "lg:ml-[88px]" : "lg:ml-[280px]"}`}>
        {/* HEADER */}
        <Header user={user} />

        {/* CONTENT */}
        <main className="px-4 py-5 pt-24 lg:px-6 lg:py-6 lg:pt-6 pb-28">
          {children}
        </main>
      </div>

      {/* MOBILE NAV */}
      <MobileBottomNav onQuickAdd={() => setOpenExpenseModal(true)} />

      {/* DESKTOP QUICK ADD */}
      <DesktopQuickAdd onClick={() => setOpenExpenseModal(true)} />

      {/* GLOBAL MODAL */}
      <AddExpenseModal
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
      />
    </div>
  );
}