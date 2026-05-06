"use client";
import { Header } from "@/components/layout/Header";
import { usePayments } from "@/hooks/usePayments";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2, Search, DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PendingTransactionsModal } from "@/components/modals/PendingTransactionsModal";
import { PaymentModal } from "@/components/modals/PaymentModal";

export default function SellerPaymentsPage() {
  const { payments, isLoading } = usePayments();
  const [search, setSearch] = useState("");
  const [isSelectModalOpen, setSelectModalOpen] = useState(false);

  const filtered = payments.filter((p: any) => 
    p.transaction?.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    p.transaction?.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Payment History" subtitle="Track all received payments and collections" />
      <div className="p-6 space-y-6">
        
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by invoice or customer..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
          <button 
            onClick={() => setSelectModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
          >
            <Plus size={18} /> Record New Payment
          </button>
        </div>

        <PendingTransactionsModal isOpen={isSelectModalOpen} onClose={() => setSelectModalOpen(false)} />
        <PaymentModal />

        {/* Payments Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Invoice</th>
                  <th className="px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold">Method</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length > 0 ? (
                  filtered.map((p: any) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(p.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium">{p.transaction?.invoiceNumber}</td>
                      <td className="px-4 py-3">
                        {p.transaction?.customer?.name || <span className="text-muted-foreground italic text-xs">Walk-in</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            p.method === "CASH" ? "bg-green-500" : "bg-blue-500"
                          )} />
                          <span className="text-xs font-medium">{p.method.replace("_", " ")}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-orange-600">
                        {formatCurrency(p.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground italic">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
