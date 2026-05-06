"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import {
  Fuel, Plus, Minus, Trash2, Receipt, User,
  ShoppingCart, Check, ChevronDown, Loader2,
} from "lucide-react";
import { formatCurrency, generateInvoiceNumber } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Product {
  id: string; name: string; fuelType: string;
  currentStock: number; sellingPrice: number; unit: string;
}
interface Customer { id: string; name: string; phone?: string; balance: number; creditLimit: number; }
interface CartItem { product: Product; quantity: number; unitPrice: number; total: number; }

const saleSchema = z.object({
  customerId: z.string().optional(),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CHEQUE", "CREDIT"]),
  paidAmount: z.number().min(0),
  discount: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
});
type SaleForm = z.infer<typeof saleSchema>;

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash", color: "text-green-600" },
  { value: "BANK_TRANSFER", label: "Bank Transfer", color: "text-blue-600" },
  { value: "CHEQUE", label: "Cheque", color: "text-purple-600" },
  { value: "CREDIT", label: "Credit", color: "text-red-500" },
];

const FUEL_COLORS: Record<string, string> = {
  PETROL: "border-orange-300 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-800",
  DIESEL: "border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800",
  KEROSENE: "border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800",
  LPG: "border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800",
};

export default function NewSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [qtyInputs, setQtyInputs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ invoice: string; total: number } | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } = useForm<SaleForm>({
    resolver: zodResolver(saleSchema),
    defaultValues: { paymentMethod: "CASH", paidAmount: 0, discount: 0 },
  });

  const paymentMethod = watch("paymentMethod");
  const discount = watch("discount") || 0;

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
    fetch("/api/customers").then(r => r.json()).then(setCustomers);
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const discountAmt = (subtotal * discount) / 100;
  const total = subtotal - discountAmt;

  const addToCart = (product: Product) => {
    const qty = parseFloat(qtyInputs[product.id] || "0");
    if (!qty || qty <= 0) { toast.error("Enter a valid quantity"); return; }
    if (qty > product.currentStock) { toast.error(`Only ${product.currentStock} ${product.unit} available`); return; }

    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > product.currentStock) { toast.error("Exceeds stock"); return prev; }
        return prev.map(i => i.product.id === product.id
          ? { ...i, quantity: newQty, total: newQty * i.unitPrice } : i);
      }
      return [...prev, { product, quantity: qty, unitPrice: product.sellingPrice, total: qty * product.sellingPrice }];
    });
    setQtyInputs(prev => ({ ...prev, [product.id]: "" }));
    toast.success(`${qty} ${product.unit} of ${product.name} added`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i => i.product.id === productId
      ? { ...i, quantity: qty, total: qty * i.unitPrice } : i));
  };

  const updatePrice = (productId: string, price: number) => {
    if (price <= 0) return;
    setCart(prev => prev.map(i => i.product.id === productId
      ? { ...i, unitPrice: price, total: i.quantity * price } : i));
  };

  const onSubmit = async (data: SaleForm) => {
    if (cart.length === 0) { toast.error("Add at least one product"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SALE",
          paymentMethod: data.paymentMethod,
          customerId: data.customerId || null,
          paidAmount: data.paidAmount,
          discount: data.discount,
          notes: data.notes,
          items: cart.map(i => ({
            productId: i.product.id,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed");
      setSuccess({ invoice: result.invoiceNumber, total: result.totalAmount });
      setCart([]);
      reset();
      setSelectedCustomer(null);
      toast.success("Sale recorded successfully!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card border border-border rounded-2xl p-10 text-center max-w-sm w-full shadow-xl">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-1">Sale Complete!</h2>
          <p className="text-muted-foreground text-sm mb-1">Invoice: <span className="font-mono font-bold text-orange-600">{success.invoice}</span></p>
          <p className="text-2xl font-bold mt-2 mb-6">{formatCurrency(success.total)}</p>
          <div className="flex gap-3">
            <button onClick={() => setSuccess(null)}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 rounded-lg font-semibold text-sm transition">
              New Sale
            </button>
            <a href="/cashier/transactions"
              className="flex-1 border border-border bg-muted hover:bg-accent py-2.5 rounded-lg font-semibold text-sm text-center transition">
              View All
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header title="New Sale" subtitle="Point of Sale — fuel transaction" />
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT — Products */}
        <div className="flex-1 overflow-y-auto p-5 border-r border-border">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Select Fuel Products</h2>
          <div className="grid grid-cols-2 gap-3">
            {products.map(p => {
              const isOutOfStock = p.currentStock <= 0;
              return (
                <div key={p.id} className={cn("rounded-xl border p-4 space-y-3", FUEL_COLORS[p.fuelType] || "border-border bg-card", isOutOfStock && "opacity-50")}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.fuelType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600">{formatCurrency(p.sellingPrice)}<span className="text-xs text-muted-foreground font-normal">/{p.unit}</span></p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Stock: {p.currentStock.toLocaleString()} {p.unit}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number" min="0" step="0.01"
                      placeholder={`Qty (${p.unit})`}
                      value={qtyInputs[p.id] || ""}
                      onChange={e => setQtyInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                      className="flex-1 h-9 px-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={isOutOfStock}
                    />
                    <button
                      onClick={() => addToCart(p)}
                      disabled={isOutOfStock}
                      className="h-9 px-3 bg-orange-600 disabled:bg-muted hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-1">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Cart & Checkout */}
        <div className="w-96 flex flex-col overflow-hidden bg-card">
          {/* Cart items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <ShoppingCart size={13} /> Cart ({cart.length} items)
            </h2>
            {cart.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <Fuel className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No items yet
              </div>
            )}
            {cart.map(item => (
              <div key={item.product.id} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-muted-foreground hover:text-destructive transition">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-md bg-muted hover:bg-accent flex items-center justify-center"><Minus size={12} /></button>
                  <input type="number" value={item.quantity} min="0" step="0.01"
                    onChange={e => updateCartQty(item.product.id, parseFloat(e.target.value) || 0)}
                    className="flex-1 h-7 text-center text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                  <button onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-md bg-muted hover:bg-accent flex items-center justify-center"><Plus size={12} /></button>
                  <span className="text-xs text-muted-foreground">{item.product.unit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">@</span>
                    <input type="number" value={item.unitPrice} step="0.001"
                      onChange={e => updatePrice(item.product.id, parseFloat(e.target.value))}
                      className="w-20 h-6 text-xs px-1 border border-input rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring" />
                  </div>
                  <span className="text-sm font-bold text-orange-600">{formatCurrency(item.total)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout form */}
          <form onSubmit={handleSubmit(onSubmit)} className="border-t border-border p-5 space-y-4">
            {/* Customer */}
            <div className="relative">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Customer (Optional)</label>
              <button type="button"
                onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
                className="w-full h-9 px-3 flex items-center justify-between rounded-lg border border-input bg-background text-sm">
                <span className={selectedCustomer ? "text-foreground" : "text-muted-foreground"}>
                  {selectedCustomer ? selectedCustomer.name : "Walk-in customer"}
                </span>
                <ChevronDown size={14} />
              </button>
              {showCustomerDropdown && (
                <div className="absolute z-20 w-full bg-popover border border-border rounded-lg shadow-lg mt-1 max-h-44 overflow-y-auto">
                  <button type="button" onClick={() => { setSelectedCustomer(null); setValue("customerId", ""); setShowCustomerDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent">Walk-in</button>
                  {customers.map(c => (
                    <button key={c.id} type="button"
                      onClick={() => { setSelectedCustomer(c); setValue("customerId", c.id); setShowCustomerDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent">
                      <span>{c.name}</span>
                      {c.balance > 0 && <span className="ml-2 text-xs text-red-500">Owes {formatCurrency(c.balance)}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <label key={m.value}
                    className={cn("flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition text-sm",
                      paymentMethod === m.value ? "border-orange-400 bg-orange-50 dark:bg-orange-950/30" : "border-border hover:bg-accent"
                    )}>
                    <input type="radio" {...register("paymentMethod")} value={m.value} className="sr-only" />
                    <span className={cn("w-3 h-3 rounded-full border-2 flex-shrink-0",
                      paymentMethod === m.value ? "border-orange-500 bg-orange-500" : "border-muted-foreground")} />
                    <span className={paymentMethod === m.value ? m.color : ""}>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Discount */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Discount %</label>
                <input type="number" {...register("discount", { valueAsNumber: true })} min="0" max="100" step="0.5"
                  className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              {paymentMethod !== "CREDIT" && (
                <div className="flex-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Amount Paid</label>
                  <input type="number" {...register("paidAmount", { valueAsNumber: true })} min="0" step="0.01"
                    className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Notes</label>
              <input {...register("notes")} placeholder="Optional note..."
                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            {/* Totals */}
            <div className="rounded-lg bg-muted p-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span><span>-{formatCurrency(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t border-border pt-1.5 mt-1.5">
                <span>Total</span><span className="text-orange-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <button type="submit" disabled={submitting || cart.length === 0}
              className="w-full h-11 bg-orange-600 disabled:opacity-60 hover:bg-orange-700 text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-orange-600/20">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Receipt size={18} />}
              {submitting ? "Processing..." : `Complete Sale • ${formatCurrency(total)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
