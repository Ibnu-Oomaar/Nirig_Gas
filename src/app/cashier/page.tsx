import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/ui/StatsCard";
import { RecentTransactions } from "@/components/tables/RecentTransactions";
import { TankGauge } from "@/components/ui/TankGauge";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, DollarSign, Receipt, Package, ChevronRight } from "lucide-react";
import { startOfDay } from "date-fns";
import Link from "next/link";
import { DashboardPaymentsClient } from "@/components/dashboard/DashboardPaymentsClient";
import { formatDate } from "@/lib/utils";

export default async function CashierDashboard() {
  const session = await getSession();
  const todayStart = startOfDay(new Date());

  const [todayTx, products, recentTx, shift, pendingPayments] = await Promise.all([
    prisma.transaction.findMany({
      where: { cashierId: session!.user.id, type: "SALE", status: "COMPLETED", createdAt: { gte: todayStart } },
      include: { items: true },
    }),
    prisma.fuelProduct.findMany({ where: { isActive: true } }),
    prisma.transaction.findMany({
      where: { cashierId: session!.user.id },
      take: 10, orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } }, cashier: true, customer: true },
    }),
    prisma.shift.findFirst({
      where: { userId: session!.user.id, isActive: true },
    }),
    prisma.transaction.findMany({
      where: { balance: { gt: 0 }, type: "SALE" },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const todayRevenue = todayTx.reduce((s, t) => s + t.totalAmount, 0);
  const todayLitres = todayTx.reduce((s, t) => s + t.items.reduce((ss, i) => ss + i.quantity, 0), 0);
  const lowStock = products.filter(p => p.currentStock <= p.minimumStock).length;

  return (
    <div>
      <Header title="Cashier Dashboard" subtitle={`Welcome back, ${session?.user.name}`} />
      <div className="p-6 space-y-6">

        {/* Quick action */}
        <div className="flex gap-3">
          <Link href="/cashier/sale"
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition shadow-md shadow-orange-600/20">
            <ShoppingCart size={18} /> New Sale
          </Link>
          <Link href="/cashier/shift"
            className="flex items-center gap-2 bg-card border border-border hover:bg-accent text-foreground px-5 py-3 rounded-xl font-semibold text-sm transition">
            <Receipt size={18} /> {shift ? "View Shift" : "Start Shift"}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Today's Revenue" value={formatCurrency(todayRevenue)} subtitle="My sales today" icon={DollarSign} variant="orange" />
          <StatsCard title="Today's Sales" value={todayTx.length} subtitle="Transactions" icon={ShoppingCart} variant="blue" />
          <StatsCard title="Litres Sold" value={`${Math.round(todayLitres).toLocaleString()} L`} subtitle="Today total" icon={Package} variant="green" />
          <StatsCard title="Low Stock" value={lowStock} subtitle="Tanks below minimum" icon={Package} variant={lowStock > 0 ? "red" : "default"} />
        </div>

        {/* Tanks */}
        <div>
          <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Current Tank Levels</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {products.map(p => (
              <TankGauge key={p.id} name={p.name} fuelType={p.fuelType} currentStock={p.currentStock}
                tankCapacity={p.tankCapacity} minimumStock={p.minimumStock} tankNumber={p.tankNumber}
                sellingPrice={p.sellingPrice} unit={p.unit} />
            ))}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending Payments</h2>
            <Link href="/cashier/payments" className="text-xs text-orange-600 font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <DashboardPaymentsClient pendingPayments={pendingPayments} />
        </div>

        {/* Recent */}

        <div className="rounded-xl border border-border bg-card">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold">My Recent Transactions</h3>
          </div>
          <RecentTransactions transactions={recentTx as any} />
        </div>
      </div>
    </div>
  );
}
