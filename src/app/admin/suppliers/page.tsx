import { Header } from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { Truck, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { transactions: true } } },
  });

  return (
    <div>
      <Header title="Suppliers" subtitle="Fuel suppliers and delivery management" />
      <div className="p-6">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" /> Suppliers ({suppliers.length})
            </h3>
            <Link href="/admin/suppliers/new"
              className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition">
              <Plus size={14} /> Add Supplier
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Company", "Contact", "Phone", "Email", "Address", "Balance", "Orders", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.contactName || "—"}</td>
                    <td className="px-4 py-3 text-xs">{s.phone}</td>
                    <td className="px-4 py-3 text-xs text-blue-600">{s.email || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.address || "—"}</td>
                    <td className="px-4 py-3 font-medium">{s.balance ? formatCurrency(s.balance) : "—"}</td>
                    <td className="px-4 py-3 text-center">{s._count.transactions}</td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                        s.status === "ACTIVE" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600"
                      )}>{s.status}</span>
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
