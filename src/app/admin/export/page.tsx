"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Download, FileText, Package, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

const EXPORTS = [
  { type: "transactions", label: "Transactions", desc: "All sales and restock records", icon: FileText, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30" },
  { type: "stock", label: "Inventory / Stock", desc: "Current stock levels and prices", icon: Package, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
  { type: "customers", label: "Customers", desc: "All customer accounts and balances", icon: Users, color: "text-green-600 bg-green-50 dark:bg-green-950/30" },
  { type: "expenses", label: "Expenses", desc: "Operating costs and expenditure", icon: DollarSign, color: "text-red-600 bg-red-50 dark:bg-red-950/30" },
];

export default function ExportPage() {
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [to, setTo] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState<string | null>(null);

  const download = async (type: string) => {
    setLoading(type);
    try {
      const url = `/api/export?type=${type}&from=${from}&to=${to}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `nirig-gas-${type}-${to}.csv`;
      a.click();
      toast.success(`${type} exported successfully`);
    } catch {
      toast.error("Export failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <Header title="Export Data" subtitle="Download reports as CSV files" />
      <div className="p-6 space-y-6 max-w-2xl">

        {/* Date Range */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From</label>
              <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">To</label>
              <input type="date" value={to} onChange={e => setTo(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
        </div>

        {/* Export options */}
        <div className="space-y-3">
          {EXPORTS.map(ex => (
            <div key={ex.type} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${ex.color}`}>
                <ex.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{ex.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{ex.desc}</p>
              </div>
              <button
                onClick={() => download(ex.type)}
                disabled={loading === ex.type}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-70 text-white text-sm px-4 py-2 rounded-lg font-medium transition"
              >
                <Download size={15} />
                {loading === ex.type ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          * Stock export always uses current data regardless of date range.
          Transactions and Expenses are filtered by the selected date range.
        </p>
      </div>
    </div>
  );
}
