"use client";
import { Header } from "@/components/layout/Header";
import { formatDateShort } from "@/lib/utils";
import { Plus, Shield, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUsers } from "@/hooks/useUsers";
import { UserWithCount } from "@/types";

const roleColors: Record<string, string> = {
  ADMIN:   "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  CASHIER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SELLER:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function UsersPage() {
  const { users, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div>
      <Header title="User Management" subtitle="Manage staff accounts and roles" />
      <div className="p-6">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-500" /> Staff ({users.length})
            </h3>
            <Link href="/admin/users/new"
              className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition">
              <Plus size={14} /> Add Staff
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Email", "Phone", "Role", "Transactions", "Shifts", "Joined", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u: UserWithCount) => (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          u.role === "ADMIN" ? "bg-orange-600" : u.role === "CASHIER" ? "bg-blue-600" : "bg-green-600"
                        )}>
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", roleColors[u.role])}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-center">{u._count?.transactions || 0}</td>
                    <td className="px-4 py-3 text-center">{u._count?.shifts || 0}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateShort(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                        u.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600"
                      )}>{u.isActive ? "Active" : "Inactive"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
