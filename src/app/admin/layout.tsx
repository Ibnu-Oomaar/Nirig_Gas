import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar role="ADMIN" userName={session.user.name ?? "Admin"} userEmail={session.user.email ?? ""} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
