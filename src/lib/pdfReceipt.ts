// src/lib/pdfReceipt.ts
// Generates a printable receipt for a transaction

export function generateReceiptHTML(tx: {
  invoiceNumber: string;
  createdAt: string | Date;
  type: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  discount: number;
  notes?: string | null;
  cashier: { name: string };
  customer?: { name: string; phone?: string | null } | null;
  supplier?: { name: string } | null;
  items: Array<{
    product: { name: string; unit: string; fuelType: string };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}): string {
  const date = new Date(tx.createdAt).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const rows = tx.items
    .map(
      (item) => `
      <tr>
        <td>${item.product.name} (${item.product.fuelType})</td>
        <td style="text-align:right">${item.quantity.toFixed(2)} ${item.product.unit}</td>
        <td style="text-align:right">$${item.unitPrice.toFixed(3)}</td>
        <td style="text-align:right">$${item.totalPrice.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Receipt — ${tx.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 12px; color: #111; max-width: 380px; margin: 0 auto; padding: 20px; }
    .center { text-align: center; }
    .brand { font-size: 20px; font-weight: bold; letter-spacing: 3px; }
    .sub { font-size: 10px; color: #555; margin-top: 2px; }
    .divider { border-top: 1px dashed #999; margin: 10px 0; }
    .row { display: flex; justify-content: space-between; margin: 4px 0; }
    .label { color: #555; }
    table { width: 100%; border-collapse: collapse; margin: 8px 0; }
    th { text-align: left; border-bottom: 1px solid #ddd; padding: 4px 0; font-size: 10px; text-transform: uppercase; color: #555; }
    td { padding: 5px 0; vertical-align: top; }
    .total-row { font-weight: bold; font-size: 14px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: bold; }
    .badge-green { background: #d1fae5; color: #065f46; }
    .badge-amber { background: #fef3c7; color: #92400e; }
    .badge-red { background: #fee2e2; color: #991b1b; }
    .footer { text-align: center; font-size: 10px; color: #777; margin-top: 16px; }
    @media print {
      body { max-width: 100%; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="center">
    <div class="brand">⛽ NIRIG GAS</div>
    <div class="sub">Fuel Station Management System</div>
    <div class="sub">Tel: +252 61 234 5678 | Hargeisa</div>
  </div>

  <div class="divider"></div>

  <div class="row"><span class="label">Invoice:</span><strong>${tx.invoiceNumber}</strong></div>
  <div class="row"><span class="label">Date:</span><span>${date}</span></div>
  <div class="row"><span class="label">Type:</span><span>${tx.type}</span></div>
  <div class="row"><span class="label">Cashier:</span><span>${tx.cashier.name}</span></div>
  ${tx.customer ? `<div class="row"><span class="label">Customer:</span><span>${tx.customer.name}</span></div>` : ""}
  ${tx.supplier ? `<div class="row"><span class="label">Supplier:</span><span>${tx.supplier.name}</span></div>` : ""}
  <div class="row"><span class="label">Payment:</span><span>${tx.paymentMethod}</span></div>
  <div class="row">
    <span class="label">Status:</span>
    <span class="badge ${tx.status === "COMPLETED" ? "badge-green" : tx.status === "PENDING" ? "badge-amber" : "badge-red"}">${tx.status}</span>
  </div>

  <div class="divider"></div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th style="text-align:right">Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="divider"></div>

  ${tx.discount > 0 ? `<div class="row"><span class="label">Subtotal:</span><span>$${(tx.totalAmount / (1 - tx.discount / 100)).toFixed(2)}</span></div>` : ""}
  ${tx.discount > 0 ? `<div class="row"><span class="label">Discount (${tx.discount}%):</span><span style="color:#ef4444">-$${((tx.totalAmount / (1 - tx.discount / 100)) * tx.discount / 100).toFixed(2)}</span></div>` : ""}
  <div class="row total-row"><span>TOTAL:</span><span>$${tx.totalAmount.toFixed(2)}</span></div>
  <div class="row"><span class="label">Paid:</span><span>$${tx.paidAmount.toFixed(2)}</span></div>
  ${tx.balance > 0 ? `<div class="row" style="color:#ef4444"><span>Balance Due:</span><strong>$${tx.balance.toFixed(2)}</strong></div>` : ""}
  ${tx.balance < 0 ? `<div class="row" style="color:#10b981"><span>Change:</span><strong>$${Math.abs(tx.balance).toFixed(2)}</strong></div>` : ""}

  ${tx.notes ? `<div class="divider"></div><div class="row"><span class="label">Notes:</span><span>${tx.notes}</span></div>` : ""}

  <div class="divider"></div>
  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Mahadsanid — شكراً لك</p>
    <p style="margin-top:6px; font-size:9px">Powered by Nirig Gas System</p>
  </div>

  <div class="no-print" style="margin-top:20px; text-align:center">
    <button onclick="window.print()" style="background:#ea580c;color:white;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:14px">
      🖨️ Print Receipt
    </button>
  </div>
</body>
</html>`;
}
