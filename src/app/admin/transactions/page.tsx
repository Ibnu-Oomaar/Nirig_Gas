import { Header } from "@/components/layout/Header";
import { RecentTransactions } from "@/components/tables/RecentTransactions";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Receipt, DollarSign, TrendingUp, Clock } from "lucide-react";
import { startOfDay } from "date-fns";

export default async function TransactionsPage() {
  const todayStart = startOfDay(new Date());

  const [transactions, todayStats] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { items: { include: { product: true } }, cashier: true, customer: true, supplier: true },
    }),
    prisma.transaction.aggregate({
      where: { type: "SALE", status: "COMPLETED", createdAt: { gte: todayStart } },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  const totalRevenue = transactions.filter(t => t.type === "SALE" && t.status === "COMPLETED").reduce((s, t) => s + t.totalAmount, 0);
  const pending = transactions.filter(t => t.status === "PENDING").length;

  return (
    <div>
      <Header title="Transactions" subtitle="All sales, restocks and adjustments" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-orange-600" },
            { label: "Today's Revenue", value: formatCurrency(todayStats._sum.totalAmount ?? 0), icon: TrendingUp, color: "text-green-600" },
            { label: "Today's Sales", value: `${todayStats._count} sales`, icon: Receipt, color: "text-blue-600" },
            { label: "Pending", value: `${pending} orders`, icon: Clock, color: "text-amber-600" },
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
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold">All Transactions ({transactions.length})</h3>
          </div>
          <RecentTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
