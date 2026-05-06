import { Header } from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { formatNumber, formatDate } from "@/lib/utils";
import { History, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function StockHistoryPage() {
  const movements = await prisma.stockMovement.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { product: true, supplier: true },
  });

  return (
    <div>
      <Header title="Stock History" subtitle="All fuel stock movements and adjustments" />
      <div className="p-6">
        <div className="rounded-xl border border-border bg-card">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <History className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold">Stock Movements ({movements.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Product", "Type", "Quantity", "Before", "After", "Reason", "Supplier", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.map(m => (
                  <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium">{m.product.name}</td>
                    <td className="px-4 py-3">
                      <span className={cn("flex items-center gap-1 text-xs font-semibold w-fit px-2 py-0.5 rounded-full",
                        m.type === "IN"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : m.type === "OUT"
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {m.type === "IN" ? <TrendingUp size={11} /> : m.type === "OUT" ? <TrendingDown size={11} /> : null}
                        {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatNumber(m.quantity)} {m.product.unit}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatNumber(m.beforeStock)}</td>
                    <td className="px-4 py-3 font-medium">{formatNumber(m.afterStock)}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{m.reason || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{m.supplier?.name || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(m.createdAt)}</td>
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
