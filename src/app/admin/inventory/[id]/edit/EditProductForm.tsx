"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Header } from "@/components/layout/Header";

const schema = z.object({
  name: z.string().min(2),
  costPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  minimumStock: z.number().min(0),
  maximumStock: z.number().min(1),
  tankCapacity: z.number().min(1),
  tankNumber: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  currentStock: z.number().min(0),
  adjustmentReason: z.string().optional(),
  priceChangeReason: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props { product: any; }

export default function EditProductForm({ product }: Props) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      minimumStock: product.minimumStock,
      maximumStock: product.maximumStock,
      tankCapacity: product.tankCapacity,
      tankNumber: product.tankNumber ?? "",
      description: product.description ?? "",
      isActive: product.isActive,
      currentStock: product.currentStock,
    },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error("Update failed"); return; }
    toast.success("Product updated!");
    router.push("/admin/inventory");
  };

  return (
    <div>
      <Header title={`Edit: ${product.name}`} subtitle="Update product details, prices, and stock" />
      <div className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-card border border-border rounded-xl p-6">

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "name", label: "Product Name", type: "text" },
              { name: "tankNumber", label: "Tank Number", type: "text" },
              { name: "costPrice", label: "Cost Price ($)", type: "number", step: "0.001" },
              { name: "sellingPrice", label: "Selling Price ($)", type: "number", step: "0.001" },
              { name: "currentStock", label: "Current Stock (manual adjust)", type: "number" },
              { name: "minimumStock", label: "Minimum Stock", type: "number" },
              { name: "maximumStock", label: "Maximum Stock", type: "number" },
              { name: "tankCapacity", label: "Tank Capacity", type: "number" },
            ].map(f => (
              <div key={f.name} className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                <input {...register(f.name as any, { valueAsNumber: f.type === "number" })}
                  type={f.type} step={(f as any).step}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Adjustment Reason</label>
              <input {...register("adjustmentReason")} placeholder="Reason for stock change"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price Change Reason</label>
              <input {...register("priceChangeReason")} placeholder="Reason for price change"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</label>
            <input {...register("description")} placeholder="Optional"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" {...register("isActive")} className="w-4 h-4 accent-orange-600" />
            <span className="text-sm font-medium">Product is Active</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 h-10 border border-border rounded-lg text-sm hover:bg-accent transition">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-70">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
