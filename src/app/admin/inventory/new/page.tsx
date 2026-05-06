"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Fuel } from "lucide-react";
import { Header } from "@/components/layout/Header";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  fuelType: z.enum(["PETROL", "DIESEL", "KEROSENE", "LPG"]),
  unit: z.string().default("Litre"),
  currentStock: z.number().min(0),
  minimumStock: z.number().min(0),
  maximumStock: z.number().min(1),
  costPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  tankCapacity: z.number().min(1),
  tankNumber: z.string().optional(),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AddProductPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fuelType: "PETROL", unit: "Litre",
      currentStock: 0, minimumStock: 500, maximumStock: 50000,
      costPrice: 0, sellingPrice: 0, tankCapacity: 50000,
    },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error("Failed to create product"); return; }
    toast.success("Product created!");
    router.push("/admin/inventory");
  };

  const fields = [
    { name: "name", label: "Product Name *", type: "text", placeholder: "Petrol 95" },
    { name: "tankNumber", label: "Tank Number", type: "text", placeholder: "Tank-01" },
    { name: "unit", label: "Unit", type: "text", placeholder: "Litre" },
    { name: "currentStock", label: "Current Stock", type: "number" },
    { name: "minimumStock", label: "Minimum Stock (alert threshold)", type: "number" },
    { name: "maximumStock", label: "Maximum Stock", type: "number" },
    { name: "tankCapacity", label: "Tank Capacity", type: "number" },
    { name: "costPrice", label: "Cost Price ($) *", type: "number", step: "0.001" },
    { name: "sellingPrice", label: "Selling Price ($) *", type: "number", step: "0.001" },
    { name: "description", label: "Description", type: "text", placeholder: "Optional notes" },
  ];

  return (
    <div>
      <Header title="Add Product" subtitle="Register a new fuel product / tank" />
      <div className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-card border border-border rounded-xl p-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fuel Type *</label>
            <select {...register("fuelType")}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {["PETROL", "DIESEL", "KEROSENE", "LPG"].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.name} className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                <input {...register(f.name as any, { valueAsNumber: f.type === "number" })}
                  type={f.type} placeholder={f.placeholder} step={(f as any).step}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                {(errors as any)[f.name] && <p className="text-destructive text-xs">{(errors as any)[f.name]?.message}</p>}
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 h-10 border border-border rounded-lg text-sm hover:bg-accent transition">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-70">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Fuel size={16} />}
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
