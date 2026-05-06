import { Header } from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { DollarSign, Plus, TrendingDown } from "lucide-react";
import Link from "next/link";
import { startOfMonth } from "date-fns";

export default async function ExpensesPage() {
  const monthStart = startOfMonth(new Date());

  const [expenses, monthlyTotal, totalAll] = await Promise.all([
    prisma.expense.findMany({ orderBy: { date: "desc" } }),
    prisma.expense.aggregate({ where: { date: { gte: monthStart } }, _sum: { amount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
  ]);

  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <Header title="Expenses" subtitle="Operating costs and expenditure tracking" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "This Month", value: formatCurrency(monthlyTotal._sum.amount ?? 0), icon: DollarSign, color: "text-red-500" },
            { label: "Total All Time", value: formatCurrency(totalAll._sum.amount ?? 0), icon: TrendingDown, color: "text-orange-600" },
            { label: "Categories", value: Object.keys(byCategory).length, icon: DollarSign, color: "text-blue-600" },
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

        {/* Category breakdown */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <div key={cat} className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{cat}</p>
              <p className="font-bold text-base mt-1">{formatCurrency(amt)}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-sm font-semibold">All Expenses ({expenses.length})</h3>
            <Link href="/admin/expenses/new"
              className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition">
              <Plus size={14} /> Add Expense
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Title", "Category", "Amount", "Description", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium">{e.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{e.category}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-500">{formatCurrency(e.amount)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{e.description || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateShort(e.date)}</td>
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
