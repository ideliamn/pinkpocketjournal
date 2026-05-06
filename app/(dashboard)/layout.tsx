import { ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen bg-pink-50">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-4 md:p-6 pb-20">
            {children}
          </main>
        </div>
      </div>

      {/* MOBILE NAV */}
      <MobileNav />
    </>
  );
}