import { Header } from "@/components/layout/Header";
import { TankGauge } from "@/components/ui/TankGauge";
import prisma from "@/lib/prisma";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default async function CashierInventoryPage() {
  const products = await prisma.fuelProduct.findMany({ where: { isActive: true }, orderBy: { fuelType: "asc" } });

  return (
    <div>
      <Header title="Inventory" subtitle="Current stock levels — read only" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {products.map(p => (
            <TankGauge key={p.id} name={p.name} fuelType={p.fuelType} currentStock={p.currentStock}
              tankCapacity={p.tankCapacity} minimumStock={p.minimumStock} tankNumber={p.tankNumber}
              sellingPrice={p.sellingPrice} unit={p.unit} />
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold">Price List</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Product", "Type", "Unit", "Sell Price", "Stock", "Min Stock", "Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map(p => {
                const isLow = p.currentStock <= p.minimumStock;
                return (
                  <tr key={p.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.fuelType}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.unit}</td>
                    <td className="px-4 py-3 font-semibold text-orange-600">{formatCurrency(p.sellingPrice)}</td>
                    <td className={`px-4 py-3 font-semibold ${isLow ? "text-red-500" : "text-foreground"}`}>
                      {formatNumber(Math.round(p.currentStock))} {p.unit}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatNumber(p.minimumStock)} {p.unit}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isLow ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                        {isLow ? "Low" : "OK"}
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
