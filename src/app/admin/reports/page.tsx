import { Header } from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { BarChart2, Download } from "lucide-react";
import { startOfMonth, subMonths } from "date-fns";

export default async function ReportsPage() {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const start = startOfMonth(subMonths(now, 5 - i));
    const end = startOfMonth(subMonths(now, 4 - i));
    return { start, end, label: start.toLocaleDateString("en-US", { month: "short", year: "2-digit" }) };
  });

  const monthlyData = await Promise.all(
    months.map(async (m) => {
      const [sales, expenses] = await Promise.all([
        prisma.transaction.aggregate({
          where: { type: "SALE", status: "COMPLETED", createdAt: { gte: m.start, lt: m.end } },
          _sum: { totalAmount: true },
          _count: true,
        }),
        prisma.expense.aggregate({
          where: { date: { gte: m.start, lt: m.end } },
          _sum: { amount: true },
        }),
      ]);
      const revenue = sales._sum.totalAmount ?? 0;
      const expense = expenses._sum.amount ?? 0;
      return { month: m.label, revenue, expense, profit: revenue - expense, count: sales._count };
    })
  );

  const [topProducts, fuelStats] = await Promise.all([
    prisma.transactionItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { totalPrice: "desc" } },
      take: 5,
    }),
    prisma.fuelProduct.findMany({ where: { isActive: true } }),
  ]);

  const productMap = Object.fromEntries(fuelStats.map(p => [p.id, p]));

  return (
    <div>
      <Header title="Reports" subtitle="Financial and operational summaries" />
      <div className="p-6 space-y-6">

        {/* Monthly Summary Table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-orange-500" /> Monthly Summary (Last 6 Months)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Month", "Revenue", "Expenses", "Net Profit", "Margin", "Transactions"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monthlyData.map(m => {
                  const margin = m.revenue ? ((m.profit / m.revenue) * 100).toFixed(1) : "0";
                  return (
                    <tr key={m.month} className="hover:bg-muted/40 transition-colors">
                      <td className="px-5 py-4 font-semibold">{m.month}</td>
                      <td className="px-5 py-4 text-orange-600 font-medium">{formatCurrency(m.revenue)}</td>
                      <td className="px-5 py-4 text-red-500">{formatCurrency(m.expense)}</td>
                      <td className="px-5 py-4 font-bold text-green-600">{formatCurrency(m.profit)}</td>
                      <td className="px-5 py-4 text-muted-foreground">{margin}%</td>
                      <td className="px-5 py-4 text-center">{m.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-border bg-card">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Product", "Type", "Qty Sold", "Revenue"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topProducts.map((tp, i) => {
                  const p = productMap[tp.productId];
                  if (!p) return null;
                  return (
                    <tr key={tp.productId} className="hover:bg-muted/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                          {p.name}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{p.fuelType}</td>
                      <td className="px-5 py-3">{formatNumber(Math.round(tp._sum.quantity ?? 0))} {p.unit}</td>
                      <td className="px-5 py-3 font-semibold text-orange-600">{formatCurrency(tp._sum.totalPrice ?? 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
