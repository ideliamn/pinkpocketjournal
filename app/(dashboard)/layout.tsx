import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getAuth } from "@/lib/auth";
const { accessToken } = await getAuth();

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!accessToken) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-4 pb-20 md:pb-4">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  );
}