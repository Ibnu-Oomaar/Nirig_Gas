import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function CashierLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.user.role !== "CASHIER") redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role="CASHIER" userName={session.user.name ?? "Cashier"} userEmail={session.user.email ?? ""} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
