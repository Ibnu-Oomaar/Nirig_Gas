"use client";
import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { usePaymentStore } from "@/store/usePaymentStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { X, Search, DollarSign, Loader2 } from "lucide-react";

export function PendingTransactionsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { transactions, isLoading } = useTransactions();
  const { setPaymentModalOpen, setSelectedTransaction } = usePaymentStore();
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const pending = transactions.filter((t: any) => 
    t.balance > 0 && 
    (t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
     t.customer?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelect = (t: any) => {
    setSelectedTransaction(t);
    setPaymentModalOpen(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold flex items-center gap-2">
            <Search className="w-4 h-4 text-orange-600" /> Select Transaction to Pay
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by invoice or customer name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {isLoading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-orange-600" /></div>
          ) : pending.length > 0 ? (
            pending.map((t: any) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-bold">{t.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground">{t.customer?.name || "Walk-in Customer"} • {formatDate(t.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-black text-red-600">{formatCurrency(t.balance)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Balance Due</p>
                  </div>
                  <button 
                    onClick={() => handleSelect(t)}
                    className="px-4 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-muted-foreground italic">No pending transactions found</div>
          )}
        </div>
      </div>
    </div>
  );
}
