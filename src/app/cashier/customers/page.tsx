import { Header } from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { Users, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function CashierCustomersPage() {
  const customers = await prisma.customer.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { transactions: true } } },
  });

  return (
    <div>
      <Header title="Customers" subtitle="View and manage customer accounts" />
      <div className="p-6">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" /> Customers ({customers.length})
            </h3>
            <Link href="/cashier/customers/new"
              className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition">
              <Plus size={14} /> Add Customer
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Phone", "Vehicle Plate", "Credit Limit", "Balance", "Transactions", "Since"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-xs font-mono">{c.vehiclePlate || "—"}</td>
                    <td className="px-4 py-3">{c.creditLimit > 0 ? formatCurrency(c.creditLimit) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={cn("font-semibold", c.balance > 0 ? "text-red-500" : "text-green-600")}>
                        {c.balance > 0 ? formatCurrency(c.balance) : "Clear"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{c._count.transactions}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateShort(c.createdAt)}</td>
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
