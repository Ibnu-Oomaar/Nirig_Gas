"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Truck } from "lucide-react";
import { Header } from "@/components/layout/Header";

const schema = z.object({
  name: z.string().min(2, "Company name required"),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7, "Phone required"),
  address: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AddSupplierPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error("Failed to create supplier"); return; }
    toast.success("Supplier added!");
    router.push("/admin/suppliers");
  };

  return (
    <div>
      <Header title="Add Supplier" subtitle="Register a new fuel supplier" />
      <div className="p-6 max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-card border border-border rounded-xl p-6">
          {[
            { name: "name", label: "Company Name *", placeholder: "Somali Petroleum Co." },
            { name: "contactName", label: "Contact Person", placeholder: "Ahmed Omar" },
            { name: "phone", label: "Phone *", placeholder: "+252 61 500 0001" },
            { name: "email", label: "Email", placeholder: "supply@company.com" },
            { name: "address", label: "Address", placeholder: "Mogadishu, Somalia" },
          ].map(f => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
              <input {...register(f.name as any)} placeholder={f.placeholder}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              {(errors as any)[f.name] && <p className="text-destructive text-xs">{(errors as any)[f.name]?.message}</p>}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 h-10 border border-border rounded-lg text-sm hover:bg-accent transition">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-70">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
