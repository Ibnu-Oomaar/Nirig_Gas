"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flame, Eye, EyeOff, Loader2, Fuel, Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const res = await signIn("credentials", { ...data, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password");
    } else {
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - Orange Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-orange-700 to-stone-900 flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/30"
              style={{ width: `${(i + 1) * 150}px`, height: `${(i + 1) * 150}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
            />
          ))}
        </div>

        {/* Centered Content */}
        <div className="relative z-10 text-center">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center shadow-2xl">
              <Flame className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white tracking-wide">NIRIG <span className="text-orange-200">GAS</span></h1>
              <p className="text-orange-200/80 text-sm mt-2">Fuel Station Management System</p>
            </div>
          </div>

          {/* Small Decorative Line */}
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mt-8" />
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-orange-300/40 text-xs tracking-wider">© 2024 Nirig Gas. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-background to-muted/20">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl">NIRIG <span className="text-orange-600">GAS</span></span>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground mt-2 text-sm">Sign in to access your dashboard</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-4 text-muted-foreground">Secure Login</span></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <input {...register("email")} type="email" placeholder="your@email.com"
                className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200" />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input {...register("password")} type={showPw ? "text" : "password"} placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="group relative w-full h-12 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30 hover:-translate-y-0.5 active:translate-y-0">
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Fuel size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>Sign In</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-xs text-muted-foreground">
              <Shield size={12} />
              <span>Secure login with role-based access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}