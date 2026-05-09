import { redirect } from "next/navigation";

import AppShell from "@/components/layout/app-shell";
import { getAuth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuth();

  // BELUM LOGIN
  if (!auth.accessToken) {
    redirect("/login");
  }

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}