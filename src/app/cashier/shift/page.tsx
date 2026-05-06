"use client";
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Clock, Play, Square, Receipt, DollarSign, Fuel } from "lucide-react";
import { toast } from "sonner";

interface ShiftData {
  shift: { id: string; startTime: string; endTime?: string; openingCash: number; closingCash?: number; totalSales: number; totalFuel: number; isActive: boolean; } | null;
  todayTransactions: any[];
  totals: { revenue: number; litres: number; count: number };
}

export default function CashierShiftPage() {
  const [data, setData] = useState<ShiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openingCash, setOpeningCash] = useState("0");
  const [closingCash, setClosingCash] = useState("0");
  const [acting, setActing] = useState(false);

  const fetchShift = async () => {
    const res = await fetch("/api/shifts/current");
    const d = await res.json();
    setData(d);
    setLoading(false);
  };

  useEffect(() => { fetchShift(); }, []);

  const startShift = async () => {
    setActing(true);
    try {
      const res = await fetch("/api/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openingCash: parseFloat(openingCash) }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Shift started!");
      fetchShift();
    } catch { toast.error("Failed to start shift"); }
    finally { setActing(false); }
  };

  const endShift = async () => {
    if (!data?.shift) return;
    setActing(true);
    try {
      const res = await fetch(`/api/shifts/${data.shift.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closingCash: parseFloat(closingCash) }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Shift ended!");
      fetchShift();
    } catch { toast.error("Failed to end shift"); }
    finally { setActing(false); }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  const shift = data?.shift;
  const totals = data?.totals ?? { revenue: 0, litres: 0, count: 0 };

  return (
    <div>
      <Header title="Shift Report" subtitle="Manage your work shift" />
      <div className="p-6 space-y-6">

        {/* Shift Status Card */}
        <div className={`rounded-2xl border-2 p-6 ${shift?.isActive ? "border-green-400 bg-green-50 dark:bg-green-950/20" : "border-border bg-card"}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${shift?.isActive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
                <span className="font-bold text-lg">{shift?.isActive ? "Shift Active" : "No Active Shift"}</span>
              </div>
              {shift && (
                <p className="text-sm text-muted-foreground">Started: {formatDate(shift.startTime)}</p>
              )}
            </div>
            <Clock className={`w-10 h-10 ${shift?.isActive ? "text-green-500" : "text-muted-foreground"}`} />
          </div>

          {!shift?.isActive && (
            <div className="mt-4 flex items-end gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Opening Cash ($)</label>
                <input type="number" value={openingCash} onChange={e => setOpeningCash(e.target.value)}
                  className="h-9 w-32 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <button onClick={startShift} disabled={acting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition">
                <Play size={16} /> Start Shift
              </button>
            </div>
          )}

          {shift?.isActive && (
            <div className="mt-4 flex items-end gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Closing Cash ($)</label>
                <input type="number" value={closingCash} onChange={e => setClosingCash(e.target.value)}
                  className="h-9 w-32 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <button onClick={endShift} disabled={acting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition">
                <Square size={16} /> End Shift
              </button>
            </div>
          )}
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Today's Revenue", value: formatCurrency(totals.revenue), icon: DollarSign, color: "text-orange-600" },
            { label: "Transactions", value: totals.count, icon: Receipt, color: "text-blue-600" },
            { label: "Litres Sold", value: `${Math.round(totals.litres).toLocaleString()} L`, icon: Fuel, color: "text-green-600" },
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

        {/* Transactions today */}
        {data?.todayTransactions && data.todayTransactions.length > 0 && (
          <div className="rounded-xl border border-border bg-card">
            <div className="p-5 border-b border-border">
              <h3 className="text-sm font-semibold">Today's Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Invoice", "Customer", "Amount", "Payment", "Status", "Time"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.todayTransactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3 font-mono text-xs text-orange-600 font-bold">{tx.invoiceNumber}</td>
                      <td className="px-4 py-3 text-xs">{tx.customer?.name || "Walk-in"}</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(tx.totalAmount)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{tx.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tx.status === "COMPLETED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700"}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(tx.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
