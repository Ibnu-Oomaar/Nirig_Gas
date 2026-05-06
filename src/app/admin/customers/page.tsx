import { Header } from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { Users, AlertCircle, CreditCard, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { transactions: true } } },
  });

  const totalCredit = customers.reduce((s, c) => s + c.balance, 0);
  const creditCustomers = customers.filter(c => c.balance > 0).length;

  return (
    <div>
      <Header title="Customers" subtitle="Customer accounts and credit management" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Customers", value: customers.length, icon: Users, color: "text-orange-600" },
            { label: "Credit Customers", value: creditCustomers, icon: CreditCard, color: "text-blue-600" },
            { label: "Total Outstanding", value: formatCurrency(totalCredit), icon: AlertCircle, color: "text-red-500" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-bold text-lg">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-sm font-semibold">All Customers ({customers.length})</h3>
            <Link href="/admin/customers/new"
              className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition">
              <Plus size={14} /> Add Customer
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Phone", "Vehicle", "Credit Limit", "Balance", "Transactions", "Since", "Status"].map(h => (
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
                    <td className="px-4 py-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                        c.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600"
                      )}>{c.isActive ? "Active" : "Inactive"}</span>
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
