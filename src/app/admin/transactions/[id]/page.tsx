import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";

const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default async function TransactionDetailPage({ params }: { params: { id: string } }) {
  const [session, tx] = await Promise.all([
    getSession(),
    prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        items: { include: { product: true } },
        cashier: { select: { name: true, email: true } },
        customer: true,
        supplier: true,
      },
    }),
  ]);

  if (!tx) notFound();

  const backPath = session?.user.role === "ADMIN" ? "/admin/transactions" : "/cashier/transactions";

  return (
    <div>
      <Header title={`Transaction: ${tx.invoiceNumber}`} subtitle={formatDate(tx.createdAt)} />
      <div className="p-6 max-w-3xl space-y-6">

        {/* Action bar */}
        <div className="flex items-center gap-3">
          <Link href={backPath}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft size={16} /> Back
          </Link>
          <a href={`/api/transactions/${tx.id}/receipt`} target="_blank"
            className="flex items-center gap-1.5 text-sm bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium transition ml-auto">
            <Printer size={16} /> Print Receipt
          </a>
        </div>

        {/* Meta card */}
        <div className="rounded-xl border border-border bg-card p-6 grid grid-cols-2 gap-4">
          {[
            { label: "Invoice", value: tx.invoiceNumber, mono: true },
            { label: "Type", value: tx.type },
            { label: "Payment Method", value: tx.paymentMethod },
            { label: "Cashier", value: tx.cashier.name },
            { label: "Customer", value: tx.customer?.name || "Walk-in" },
            { label: "Supplier", value: tx.supplier?.name || "—" },
            { label: "Date", value: formatDate(tx.createdAt) },
            { label: "Notes", value: tx.notes || "—" },
          ].map(row => (
            <div key={row.label}>
              <p className="text-xs text-muted-foreground">{row.label}</p>
              <p className={cn("font-medium mt-0.5", row.mono && "font-mono text-orange-600")}>{row.value}</p>
            </div>
          ))}

          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block", statusColors[tx.status] || "")}>
              {tx.status}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold">Line Items</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {["Product", "Fuel Type", "Quantity", "Unit Price", "Total"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tx.items.map(item => (
                <tr key={item.id} className="hover:bg-muted/40">
                  <td className="px-5 py-3 font-medium">{item.product.name}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{item.product.fuelType}</td>
                  <td className="px-5 py-3">{item.quantity.toFixed(2)} {item.product.unit}</td>
                  <td className="px-5 py-3">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-5 py-3 font-semibold text-orange-600">{formatCurrency(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="rounded-xl border border-border bg-card p-6 max-w-sm ml-auto space-y-2 text-sm">
          {tx.discount > 0 && (
            <>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(tx.totalAmount / (1 - tx.discount / 100))}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount ({tx.discount}%)</span>
                <span>-{formatCurrency((tx.totalAmount / (1 - tx.discount / 100)) * tx.discount / 100)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between font-bold text-base border-t border-border pt-2">
            <span>Total</span><span className="text-orange-600">{formatCurrency(tx.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Paid</span><span>{formatCurrency(tx.paidAmount)}</span>
          </div>
          {tx.balance > 0 && (
            <div className="flex justify-between font-bold text-red-500">
              <span>Balance Due</span><span>{formatCurrency(tx.balance)}</span>
            </div>
          )}
          {tx.balance < 0 && (
            <div className="flex justify-between font-bold text-green-600">
              <span>Change</span><span>{formatCurrency(Math.abs(tx.balance))}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
