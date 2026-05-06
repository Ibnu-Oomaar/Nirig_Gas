import { Header } from "@/components/layout/Header";
import { TankGauge } from "@/components/ui/TankGauge";
import prisma from "@/lib/prisma";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Package, Plus, Edit, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function InventoryPage() {
  const products = await prisma.fuelProduct.findMany({
    orderBy: { fuelType: "asc" },
    include: {
      _count: { select: { transactionItems: true } },
    },
  });

  const totalValue = products.reduce((s, p) => s + p.currentStock * p.costPrice, 0);
  const totalRevValue = products.reduce((s, p) => s + p.currentStock * p.sellingPrice, 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minimumStock).length;

  return (
    <div>
      <Header title="Inventory" subtitle="Fuel stock levels and product management" />
      <div className="p-6 space-y-6">

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Stock Value (Cost)", value: formatCurrency(totalValue), icon: TrendingDown, color: "text-blue-600" },
            { label: "Total Stock Value (Sell)", value: formatCurrency(totalRevValue), icon: TrendingUp, color: "text-green-600" },
            { label: "Low Stock Alerts", value: `${lowStockCount} products`, icon: Package, color: "text-red-500" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <s.icon className={cn("w-8 h-8", s.color)} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-bold text-lg">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tank Gauges */}
        <div>
          <h2 className="text-base font-semibold mb-3">Tank Overview</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {products.map(p => (
              <TankGauge key={p.id} name={p.name} fuelType={p.fuelType} currentStock={p.currentStock}
                tankCapacity={p.tankCapacity} minimumStock={p.minimumStock} tankNumber={p.tankNumber}
                sellingPrice={p.sellingPrice} unit={p.unit} />
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="text-sm font-semibold">Product Catalog</h3>
            <Link href="/admin/inventory/new"
              className="flex items-center gap-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition">
              <Plus size={14} /> Add Product
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Product", "Type", "Tank", "Current Stock", "Min/Max", "Cost Price", "Sell Price", "Margin", "Transactions", "Status", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map(p => {
                  const margin = ((p.sellingPrice - p.costPrice) / p.costPrice * 100).toFixed(1);
                  const isLow = p.currentStock <= p.minimumStock;
                  return (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold",
                          p.fuelType === "PETROL" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                          p.fuelType === "DIESEL" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                          p.fuelType === "KEROSENE" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        )}>{p.fuelType}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.tankNumber || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={cn("font-semibold", isLow ? "text-red-500" : "text-foreground")}>
                          {formatNumber(Math.round(p.currentStock))} {p.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatNumber(p.minimumStock)} / {formatNumber(p.maximumStock)}
                      </td>
                      <td className="px-4 py-3">{formatCurrency(p.costPrice)}</td>
                      <td className="px-4 py-3 font-medium text-orange-600">{formatCurrency(p.sellingPrice)}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">{margin}%</td>
                      <td className="px-4 py-3 text-muted-foreground">{p._count.transactionItems}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                          p.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600"
                        )}>{p.isActive ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/inventory/${p.id}/edit`}
                          className="text-muted-foreground hover:text-orange-600 transition">
                          <Edit size={14} />
                        </Link>
                      </td>
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
