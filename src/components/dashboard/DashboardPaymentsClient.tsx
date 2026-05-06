"use client";
import { PaymentModal } from "@/components/modals/PaymentModal";
import { usePaymentStore } from "@/store/usePaymentStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign } from "lucide-react";

export function DashboardPaymentsClient({ pendingPayments }: { pendingPayments: any[] }) {
  const { setPaymentModalOpen, setSelectedTransaction } = usePaymentStore();

  const handlePay = (p: any) => {
    setSelectedTransaction(p);
    setPaymentModalOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="divide-y divide-border">
          {pendingPayments.length > 0 ? (
            pendingPayments.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors group">
                <div>
                  <p className="text-sm font-semibold">{p.customer?.name || "Walk-in Customer"}</p>
                  <p className="text-[10px] text-muted-foreground">{p.invoiceNumber} • {formatDate(p.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{formatCurrency(p.balance)}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">Balance</p>
                  </div>
                  <button 
                    onClick={() => handlePay(p)}
                    className="p-2 rounded-lg bg-orange-600 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-700 shadow-lg shadow-orange-600/20"
                    title="Record Payment"
                  >
                    <DollarSign className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground italic">
              No pending payments found.
            </div>
          )}
        </div>
      </div>
      <PaymentModal />
    </>
  );
}
