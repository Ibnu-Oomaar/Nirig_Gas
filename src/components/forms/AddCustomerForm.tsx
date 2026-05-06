"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Header } from "@/components/layout/Header";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  vehiclePlate: z.string().optional(),
  creditLimit: z.number().min(0).default(0),
});
type FormData = z.infer<typeof schema>;

interface Props { backPath: string; }

export default function AddCustomerForm({ backPath }: Props) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { creditLimit: 0 },
  });

  const onSubmit = async (data: FormData) => {
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error("Failed to create customer"); return; }
    toast.success("Customer created!");
    router.push(backPath);
  };

  return (
    <div>
      <Header title="Add Customer" subtitle="Create a new customer account" />
      <div className="p-6 max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-card border border-border rounded-xl p-6">
          {[
            { name: "name", label: "Full Name *", type: "text", placeholder: "John Doe" },
            { name: "phone", label: "Phone", type: "tel", placeholder: "+252 61 234 5678" },
            { name: "email", label: "Email", type: "email", placeholder: "customer@example.com" },
            { name: "address", label: "Address", type: "text", placeholder: "City, Street" },
            { name: "vehiclePlate", label: "Vehicle Plate", type: "text", placeholder: "SOM-001" },
          ].map(f => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
              <input {...register(f.name as any)} type={f.type} placeholder={f.placeholder}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              {(errors as any)[f.name] && <p className="text-destructive text-xs">{(errors as any)[f.name]?.message}</p>}
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Credit Limit ($)</label>
            <input {...register("creditLimit", { valueAsNumber: true })} type="number" min="0" step="0.01" placeholder="0"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()}
              className="flex-1 h-10 border border-border rounded-lg text-sm hover:bg-accent transition">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-70">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              Create Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
