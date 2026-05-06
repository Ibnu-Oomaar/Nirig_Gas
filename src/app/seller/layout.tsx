import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.user.role !== "SELLER") redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role="SELLER" userName={session.user.name ?? "Seller"} userEmail={session.user.email ?? ""} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
