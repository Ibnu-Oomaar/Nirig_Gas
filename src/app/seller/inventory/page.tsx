import { Header } from "@/components/layout/Header";
import { TankGauge } from "@/components/ui/TankGauge";
import prisma from "@/lib/prisma";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default async function SellerInventoryPage() {
  const products = await prisma.fuelProduct.findMany({
    where: { isActive: true },
    orderBy: { fuelType: "asc" },
  });

  const totalStockValue = products.reduce((s, p) => s + p.currentStock * p.sellingPrice, 0);

  return (
    <div>
      <Header title="Stock Inventory" subtitle="Monitor all fuel tank levels" />
      <div className="p-6 space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold mt-1">{products.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Low Stock Tanks</p>
            <p className={`text-2xl font-bold mt-1 ${products.filter(p => p.currentStock <= p.minimumStock).length > 0 ? "text-red-500" : "text-green-600"}`}>
              {products.filter(p => p.currentStock <= p.minimumStock).length}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Total Stock Value</p>
            <p className="text-2xl font-bold mt-1 text-orange-600">{formatCurrency(totalStockValue)}</p>
          </div>
        </div>

        {/* Tank Gauges */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {products.map(p => (
            <TankGauge key={p.id} name={p.name} fuelType={p.fuelType} currentStock={p.currentStock}
              tankCapacity={p.tankCapacity} minimumStock={p.minimumStock} tankNumber={p.tankNumber}
              sellingPrice={p.sellingPrice} unit={p.unit} />
          ))}
        </div>

        {/* Detail Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold">Detailed Stock View</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Product", "Tank No.", "Current Stock", "Capacity", "Fill %", "Min Stock", "Sell Price", "Stock Value", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map(p => {
                const fillPct = Math.round((p.currentStock / p.tankCapacity) * 100);
                const isLow = p.currentStock <= p.minimumStock;
                const isCritical = p.currentStock <= p.minimumStock * 0.5;
                return (
                  <tr key={p.id} className={`hover:bg-muted/40 transition-colors ${isCritical ? "bg-red-50/50 dark:bg-red-950/10" : ""}`}>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{p.tankNumber || "—"}</td>
                    <td className={`px-4 py-3 font-semibold ${isLow ? "text-red-500" : "text-foreground"}`}>
                      {formatNumber(Math.round(p.currentStock))} {p.unit}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatNumber(p.tankCapacity)} {p.unit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCritical ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-green-500"}`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{fillPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatNumber(p.minimumStock)} {p.unit}</td>
                    <td className="px-4 py-3 font-medium text-orange-600">{formatCurrency(p.sellingPrice)}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(p.currentStock * p.sellingPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isCritical ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : isLow ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                        {isCritical ? "Critical" : isLow ? "Low" : "OK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
