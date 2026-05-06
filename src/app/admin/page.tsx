import { Header } from "@/components/layout/Header";
import { StatsCard } from "@/components/ui/StatsCard";
import { TankGauge } from "@/components/ui/TankGauge";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { FuelBreakdownChart } from "@/components/charts/FuelBreakdownChart";
import { RecentTransactions } from "@/components/tables/RecentTransactions";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign, ShoppingCart, Package, Users,
  TrendingUp, AlertTriangle, Fuel, Truck,
  Zap, Calendar, Activity, ChevronRight
} from "lucide-react";
import { subDays, startOfDay } from "date-fns";
import { formatDate } from "@/lib/utils";
import { DashboardPaymentsClient } from "@/components/dashboard/DashboardPaymentsClient";

async function getDashboardData() {
  const todayStart = startOfDay(new Date());
  const weekAgo = subDays(new Date(), 7);
  const prevWeekStart = subDays(new Date(), 14);

  const [
    todayTx, weekTx, prevWeekTx,
    totalCustomers, products, recentTx,
    pendingTx, expenses,
  ] = await Promise.all([
    prisma.transaction.findMany({ where: { type: "SALE", status: "COMPLETED", createdAt: { gte: todayStart } }, include: { items: true } }),
    prisma.transaction.findMany({ where: { type: "SALE", status: "COMPLETED", createdAt: { gte: weekAgo } }, include: { items: true } }),
    prisma.transaction.findMany({ where: { type: "SALE", status: "COMPLETED", createdAt: { gte: prevWeekStart, lt: weekAgo } }, include: { items: true } }),
    prisma.customer.count({ where: { isActive: true } }),
    prisma.fuelProduct.findMany({ where: { isActive: true } }),
    prisma.transaction.findMany({
      take: 8, orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } }, cashier: true, customer: true },
    }),
    prisma.transaction.findMany({ 
      where: { balance: { gt: 0 }, type: "SALE" },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 5 
    }),
    prisma.expense.findMany({ where: { date: { gte: weekAgo } } }),
  ]);

  const todayRevenue = todayTx.reduce((s, t) => s + t.totalAmount, 0);
  const weekRevenue = weekTx.reduce((s, t) => s + t.totalAmount, 0);
  const prevRevenue = prevWeekTx.reduce((s, t) => s + t.totalAmount, 0);
  const revTrend = prevRevenue ? ((weekRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const totalStock = products.reduce((s, p) => s + p.currentStock, 0);
  const lowStock = products.filter(p => p.currentStock <= p.minimumStock).length;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  // Last 7 days chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(day);
    const dayEnd = startOfDay(subDays(day, -1));
    const dayTx = weekTx.filter(t => {
      const d = new Date(t.createdAt);
      return d >= dayStart && d < dayEnd;
    });
    return {
      date: day.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: dayTx.reduce((s, t) => s + t.totalAmount, 0),
      litres: dayTx.reduce((s, t) => s + t.items.reduce((ss, i) => ss + i.quantity, 0), 0),
    };
  });

  const fuelBreakdown = products.map((p, i) => ({
    name: p.name,
    value: Math.round(p.currentStock),
    color: ["#ea580c", "#3b82f6", "#f59e0b", "#22c55e"][i % 4],
  }));

  return {
    todayRevenue, weekRevenue, revTrend,
    todaySales: todayTx.length, weekSales: weekTx.length,
    totalCustomers, totalStock, lowStock,
    pendingPayments: pendingTx.length,
    pendingTx,
    products, recentTx, chartData, fuelBreakdown, totalExpenses,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header title="Dashboard" subtitle="Nirig Gas & Fuel Station — Overview" />

      <div className="p-6 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 p-6 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-3xl" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Welcome back, Admin</p>
              <h2 className="text-3xl font-bold mt-1">Fuel Station Dashboard</h2>
              <p className="text-white/70 text-sm mt-2">Monitor your station performance in real-time</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatsCard 
            title="Today's Revenue" 
            value={formatCurrency(data.todayRevenue)} 
            subtitle={`${data.todaySales} transactions`} 
            icon={DollarSign} 
            variant="orange" 
            trend={{ value: Math.round(data.revTrend), label: "vs last week" }} 
          />
          <StatsCard 
            title="Week Revenue" 
            value={formatCurrency(data.weekRevenue)} 
            subtitle={`${data.weekSales} transactions`} 
            icon={TrendingUp} 
            variant="blue" 
          />
          <StatsCard 
            title="Total Customers" 
            value={data.totalCustomers} 
            subtitle="Active accounts" 
            icon={Users} 
            variant="green" 
          />
          <StatsCard 
            title="Low Stock Alerts" 
            value={data.lowStock} 
            subtitle="Products below minimum" 
            icon={AlertTriangle} 
            variant={data.lowStock > 0 ? "red" : "default"} 
          />
        </div>

        {/* Tank Status Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10">
                <Fuel className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Tank Status</h2>
                <p className="text-sm text-muted-foreground">Real-time fuel inventory monitoring</p>
              </div>
            </div>
            <a href="/admin/inventory" className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data.products.map((p) => (
              <TankGauge
                key={p.id}
                name={p.name}
                fuelType={p.fuelType}
                currentStock={p.currentStock}
                tankCapacity={p.tankCapacity}
                minimumStock={p.minimumStock}
                tankNumber={p.tankNumber}
                sellingPrice={p.sellingPrice}
                unit={p.unit}
              />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">Revenue Trend</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Last 7 days performance</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                <Zap className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-medium">Live Data</span>
              </div>
            </div>
            <RevenueChart data={data.chartData} />
          </div>
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
            <div>
              <h3 className="text-base font-semibold text-foreground">Stock Breakdown</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Current fuel inventory distribution</p>
            </div>
            <div className="mt-4">
              <FuelBreakdownChart data={data.fuelBreakdown} />
            </div>
          </div>
        </div>
        
        {/* Pending Payments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10">
                <DollarSign className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Pending Payments</h2>
                <p className="text-sm text-muted-foreground">Customers with outstanding credit balances</p>
              </div>
            </div>
            <a href="/admin/payments" className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors">
              Manage All <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <DashboardPaymentsClient pendingPayments={data.pendingTx as any} />
        </div>

        {/* Recent Transactions Section */}
        <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h3 className="text-base font-semibold text-foreground">Recent Transactions</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Latest sales and activities</p>
            </div>
            <a href="/admin/transactions" className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors">
              View all transactions <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <RecentTransactions transactions={data.recentTx as any} />
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{data.totalStock.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Litres in Stock</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <Truck className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{data.pendingPayments}</p>
              <p className="text-xs text-muted-foreground">Pending Payments</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="p-3 rounded-xl bg-red-500/10">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{data.lowStock}</p>
              <p className="text-xs text-muted-foreground">Low Stock Alerts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}