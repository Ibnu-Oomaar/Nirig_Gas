"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, DollarSign } from "lucide-react";
import { Header } from "@/components/layout/Header";

const CATEGORIES = ["Payroll", "Utilities", "Maintenance", "Security", "Fuel Purchase", "Transport", "Office", "Other"];

const schema = z.object({
  title: z.string().min(2, "Title required"),
  amount: z.number().min(0.01, "Amount required"),
  category: z.string().min(1, "Category required"),
  description: z.string().optional(),
  date: z.string(),
});
type FormData = z.infer<typeof schema>;

export default function AddExpensePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split("T")[0], category: "Other" },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, amount: Number(data.amount) }),
    });
    if (!res.ok) { toast.error("Failed to add expense"); return; }
    toast.success("Expense recorded!");
    router.push("/admin/expenses");
  };

  return (
    <div>
      <Header title="Add Expense" subtitle="Record a new operating cost" />
      <div className="p-6 max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-card border border-border rounded-xl p-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title *</label>
            <input {...register("title")} placeholder="e.g. Staff Salaries"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount ($) *</label>
              <input {...register("amount", { valueAsNumber: true })} type="number" step="0.01" min="0"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              {errors.amount && <p className="text-destructive text-xs">{errors.amount.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date *</label>
              <input {...register("date")} type="date"
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category *</label>
            <select {...register("category")}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</label>
            <textarea {...register("description")} rows={3} placeholder="Optional details..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 h-10 border border-border rounded-lg text-sm hover:bg-accent transition">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-70">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <DollarSign size={16} />}
              Record Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
