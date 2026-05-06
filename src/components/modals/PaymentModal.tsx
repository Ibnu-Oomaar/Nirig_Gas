"use client";
import { useState } from "react";
import { usePaymentStore } from "@/store/usePaymentStore";
import { usePayments } from "@/hooks/usePayments";
import { formatCurrency } from "@/lib/utils";
import { X, DollarSign, Loader2 } from "lucide-react";

export function PaymentModal() {
  const { isPaymentModalOpen, setPaymentModalOpen, selectedTransaction } = usePaymentStore();
  const { createPayment } = usePayments();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");

  if (!isPaymentModalOpen || !selectedTransaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPayment.mutateAsync({
      transactionId: selectedTransaction.id,
      amount: parseFloat(amount),
      method,
    });
    setPaymentModalOpen(false);
    setAmount("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-600" /> Record Payment
          </h3>
          <button onClick={() => setPaymentModalOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Transaction</p>
            <p className="text-sm font-bold mt-1">{selectedTransaction.invoiceNumber}</p>
            <p className="text-xs text-muted-foreground">{selectedTransaction.customer?.name || "Walk-in Customer"}</p>
            <div className="mt-3 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Remaining Balance</p>
                <p className="text-lg font-black text-red-600">{formatCurrency(selectedTransaction.balance)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Amount</label>
            <input 
              type="number" 
              step="0.01" 
              required
              max={selectedTransaction.balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={createPayment.isPending || !amount}
            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {createPayment.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
            Record Payment
          </button>
        </form>
      </div>
    </div>
  );
}
