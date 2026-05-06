"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { formatCurrency } from "@/lib/utils";
import { Truck, Plus, Trash2, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Product { id: string; name: string; fuelType: string; unit: string; currentStock: number; costPrice: number; }
interface Supplier { id: string; name: string; }
interface CartItem { product: Product; quantity: number; unitPrice: number; }

export default function RestockPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [qtyMap, setQtyMap] = useState<Record<string, string>>({});
  const [priceMap, setPriceMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/suppliers").then(r => r.json()),
    ]).then(([p, s]) => { setProducts(p); setSuppliers(s); });
  }, []);

  const addToCart = (product: Product) => {
    const qty = parseFloat(qtyMap[product.id] || "0");
    const price = parseFloat(priceMap[product.id] || String(product.costPrice));
    if (!qty || qty <= 0) { toast.error("Enter valid quantity"); return; }
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty, unitPrice: price } : i);
      return [...prev, { product, quantity: qty, unitPrice: price }];
    });
    setQtyMap(prev => ({ ...prev, [product.id]: "" }));
    toast.success(`Added ${qty} ${product.unit} of ${product.name}`);
  };

  const total = cart.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const submit = async () => {
    if (!cart.length) { toast.error("Add at least one product"); return; }
    if (!supplierId) { toast.error("Select a supplier"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "RESTOCK",
          paymentMethod,
          supplierId,
          paidAmount: total,
          notes,
          items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity, unitPrice: i.unitPrice })),
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success("Restock recorded!");
      router.push("/admin/inventory");
    } catch (e: any) { toast.error(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div>
      <Header title="Fuel Restock" subtitle="Receive fuel delivery from supplier" />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Products */}
        <div className="flex-1 overflow-y-auto p-5 border-r border-border">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Select Products to Restock</h2>
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.fuelType} • Current: {p.currentStock.toLocaleString()} {p.unit}</p>
                </div>
                <input type="number" min="0" step="1" placeholder={`Qty (${p.unit})`}
                  value={qtyMap[p.id] || ""}
                  onChange={e => setQtyMap(prev => ({ ...prev, [p.id]: e.target.value }))}
                  className="w-28 h-9 px-2 rounded-lg border border-input bg-background text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="number" min="0" step="0.001" placeholder="Cost/unit"
                  value={priceMap[p.id] ?? p.costPrice}
                  onChange={e => setPriceMap(prev => ({ ...prev, [p.id]: e.target.value }))}
                  className="w-28 h-9 px-2 rounded-lg border border-input bg-background text-sm text-center focus:outline-none focus:ring-2 focus:ring-ring" />
                <button onClick={() => addToCart(p)}
                  className="h-9 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-1">
                  <Plus size={14} /> Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-96 flex flex-col bg-card border-l border-border overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <Truck size={13} /> Delivery ({cart.length} items)
            </h2>
            {cart.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">No products added yet</div>
            )}
            {cart.map(item => (
              <div key={item.product.id} className="rounded-lg border border-border p-3 mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">{item.quantity} {item.product.unit} × {formatCurrency(item.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-orange-600">{formatCurrency(item.quantity * item.unitPrice)}</span>
                  <button onClick={() => setCart(prev => prev.filter(i => i.product.id !== item.product.id))}
                    className="text-muted-foreground hover:text-destructive transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-border space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Supplier *</label>
              <select value={supplierId} onChange={e => setSupplierId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select supplier...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {["CASH", "BANK_TRANSFER", "CHEQUE", "CREDIT"].map(m => <option key={m} value={m}>{m.replace("_", " ")}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notes</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Delivery note, batch no..."
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>

            <div className="rounded-lg bg-muted p-3 flex justify-between font-bold">
              <span>Total Cost</span>
              <span className="text-orange-600">{formatCurrency(total)}</span>
            </div>

            <button onClick={submit} disabled={submitting || !cart.length}
              className="w-full h-11 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              {submitting ? "Recording..." : `Confirm Restock • ${formatCurrency(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
