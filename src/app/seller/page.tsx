import { Header } from "@/components/layout/Header";
import { TankGauge } from "@/components/ui/TankGauge";
import { StatsCard } from "@/components/ui/StatsCard";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, AlertTriangle, TrendingUp, Bell, DollarSign } from "lucide-react";
import { subDays } from "date-fns";
import { DashboardPaymentsClient } from "@/components/dashboard/DashboardPaymentsClient";

export default async function SellerDashboard() {
  const weekAgo = subDays(new Date(), 7);

  const [products, alerts, weekSales, pendingPayments] = await Promise.all([
    prisma.fuelProduct.findMany({ where: { isActive: true }, orderBy: { fuelType: "asc" } }),
    prisma.alert.findMany({ where: { isRead: false }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.transactionItem.groupBy({
      by: ["productId"],
      where: { transaction: { createdAt: { gte: weekAgo }, type: "SALE", status: "COMPLETED" } },
      _sum: { quantity: true, totalPrice: true },
    }),
    prisma.transaction.findMany({
      where: { balance: { gt: 0 }, type: "SALE" },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const lowStockCount = products.filter(p => p.currentStock <= p.minimumStock).length;
  const totalStock = products.reduce((s, p) => s + p.currentStock, 0);
  const weekRevenue = weekSales.reduce((s, i) => s + (i._sum.totalPrice ?? 0), 0);
  const totalDebt = await prisma.transaction.aggregate({
    where: { balance: { gt: 0 }, type: "SALE" },
    _sum: { balance: true },
  });

  return (
    <div>
      <Header title="Seller Dashboard" subtitle="Inventory overview & alerts" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard title="Total Stock" value={`${Math.round(totalStock).toLocaleString()} L`} subtitle="All tanks combined" icon={Package} variant="blue" />
          <StatsCard title="Pending Payments" value={formatCurrency(totalDebt._sum.balance || 0)} subtitle="Total outstanding debt" icon={DollarSign} variant="red" />
          <StatsCard title="Week Revenue" value={formatCurrency(weekRevenue)} subtitle="Last 7 days" icon={TrendingUp} variant="orange" />
          <StatsCard title="Unread Alerts" value={alerts.length} subtitle="Pending notifications" icon={Bell} variant={alerts.length > 0 ? "red" : "default"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tank overview */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Tank Levels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <TankGauge key={p.id} name={p.name} fuelType={p.fuelType} currentStock={p.currentStock}
                  tankCapacity={p.tankCapacity} minimumStock={p.minimumStock} tankNumber={p.tankNumber}
                  sellingPrice={p.sellingPrice} unit={p.unit} />
              ))}
            </div>
          </div>

          {/* Pending Payments List */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending Payments</h2>
            <DashboardPaymentsClient pendingPayments={pendingPayments} />
            {pendingPayments.length > 0 && (
              <div className="p-3 text-center">
                <a href="/seller/payments" className="text-xs text-orange-600 font-semibold hover:underline">View All Payments →</a>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 p-5 border-b border-border">
              <Bell className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold">Unread Alerts ({alerts.length})</h3>
            </div>
            <div className="divide-y divide-border">
              {alerts.map(a => (
                <div key={a.id} className="flex items-start gap-3 p-4">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === "LOW_STOCK" ? "bg-red-500" : a.type === "PRICE_CHANGE" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDate(a.createdAt)}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${a.type === "LOW_STOCK" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                    {a.type.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
