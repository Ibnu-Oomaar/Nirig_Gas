import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PENDING:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED:  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const typeColors: Record<string, string> = {
  SALE:       "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  RESTOCK:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ADJUSTMENT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  TRANSFER:   "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
};

const payColors: Record<string, string> = {
  CASH:          "text-green-600",
  BANK_TRANSFER: "text-blue-600",
  CREDIT:        "text-red-500",
  CHEQUE:        "text-purple-600",
};

interface Props {
  transactions: any[];
}

export function RecentTransactions({ transactions }: Props) {
  if (!transactions.length) {
    return <div className="p-8 text-center text-sm text-muted-foreground">No transactions yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {["Invoice", "Type", "Customer/Supplier", "Cashier", "Amount", "Payment", "Status", "Date"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
              <td className="px-4 py-3 font-mono text-xs font-semibold text-orange-600">{tx.invoiceNumber}</td>
              <td className="px-4 py-3">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", typeColors[tx.type] || "")}>{tx.type}</span>
              </td>
              <td className="px-4 py-3 text-xs">
                {tx.customer?.name || tx.supplier?.name || <span className="text-muted-foreground">Walk-in</span>}
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{tx.cashier?.name || "—"}</td>
              <td className="px-4 py-3 font-semibold">{formatCurrency(tx.totalAmount)}</td>
              <td className={cn("px-4 py-3 text-xs font-medium", payColors[tx.paymentMethod] || "")}>{tx.paymentMethod}</td>
              <td className="px-4 py-3">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColors[tx.status] || "")}>{tx.status}</span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(tx.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
