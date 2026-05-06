"use client";
import React from "react";
import Link from "next/link";
import { 
  Flame, 
  ArrowRight, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  Fuel, 
  Smartphone, 
  Globe,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">NIRIG <span className="text-orange-600">GAS</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
            <a href="#solutions" className="hover:text-orange-600 transition-colors">Solutions</a>
            <a href="#about" className="hover:text-orange-600 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-orange-600 transition-colors">
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-bold hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-orange-600/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-orange-500/10 via-transparent to-transparent blur-3xl -z-10" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-xs font-bold mb-8 animate-fade-in">
              <Zap size={14} className="fill-orange-600" />
              <span>POWERING OVER 50+ STATIONS NATIONWIDE</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-8">
              Fueling the Future of <br />
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 bg-clip-text text-transparent">
                Station Management
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              The all-in-one platform for gas station owners. Track inventory, manage sales, 
              and optimize operations with real-time analytics and role-based control.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/login" 
                className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition-all duration-300 shadow-xl shadow-orange-600/25 hover:-translate-y-1"
              >
                Launch Dashboard
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-secondary text-foreground font-bold text-lg border border-border hover:bg-accent transition-all duration-300">
                Book a Demo
              </button>
            </div>
          </div>

          {/* Hero Image / Dashboard Preview Mockup */}
          <div className="mt-20 relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="rounded-[2.5rem] border-8 border-card bg-card shadow-2xl overflow-hidden group">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src="https://i.pinimg.com/736x/c6/a0/39/c6a0398f3ff1f4fc98221b2368f3722a.jpg" 
                  alt="Nirig Gas Dashboard Preview" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay UI elements */}
                <div className="absolute top-6 left-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hidden lg:block animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="text-green-500 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Today's Revenue</p>
                      <p className="text-white font-black text-lg">$12,450.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { label: "Fuel Stations", value: "150+" },
              { label: "Monthly Revenue", value: "$4.2M" },
              { label: "Active Users", value: "2.5k" },
              { label: "Uptime", value: "99.9%" }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl lg:text-5xl font-black text-foreground mb-2">{s.value}</p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="solutions" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10" />
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h3 className="text-4xl font-bold mb-6">Simple, Transparent Pricing</h3>
            <p className="text-muted-foreground text-lg">Choose the perfect plan for your station's growth.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$49",
                desc: "Ideal for small single-tank stations.",
                features: ["1 Station", "2 User Accounts", "Basic Analytics", "Email Support"],
                cta: "Start Free Trial",
                popular: false
              },
              {
                name: "Professional",
                price: "$149",
                desc: "Perfect for busy multi-tank stations.",
                features: ["Up to 3 Stations", "Unlimited Users", "Advanced Analytics", "PDF Receipts", "24/7 Priority Support"],
                cta: "Get Started",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For large fuel station networks.",
                features: ["Unlimited Stations", "Custom Integrations", "Dedicated Account Manager", "On-site Training", "SLA Guarantee"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((p, i) => (
              <div key={i} className={cn(
                "p-10 rounded-[2.5rem] border transition-all duration-500 relative",
                p.popular 
                  ? "bg-foreground text-background border-foreground shadow-2xl scale-105 z-10" 
                  : "bg-card text-foreground border-border hover:border-orange-500/50"
              )}>
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <h4 className="text-2xl font-bold mb-2">{p.name}</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black">{p.price}</span>
                  {p.price !== "Custom" && <span className="text-sm opacity-60">/month</span>}
                </div>
                <p className="text-sm opacity-70 mb-8 leading-relaxed">{p.desc}</p>
                
                <ul className="space-y-4 mb-10">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 size={18} className={cn(p.popular ? "text-orange-500" : "text-orange-600")} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all duration-300",
                  p.popular 
                    ? "bg-orange-600 text-white hover:bg-orange-700" 
                    : "bg-secondary text-foreground hover:bg-accent border border-border"
                )}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-orange-600/5 border-y border-orange-600/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-8">Trusted by Station Owners <br /> Across the Region</h3>
              <p className="text-muted-foreground text-lg mb-10">
                "Nirig Gas completely changed how we handle our daily shifts. 
                I can monitor my station's revenue from my phone while I'm at home. 
                The stock alerts have saved us from running out of fuel multiple times."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-200" />
                <div>
                  <p className="font-bold">Ahmed Mohamed</p>
                  <p className="text-sm text-muted-foreground font-medium">Owner, Somali Fuel Co.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square rounded-3xl bg-card border border-border flex items-center justify-center p-8">
                   <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-orange-600" />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h3 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {[
              { q: "How long does it take to set up?", a: "Most stations are fully operational within 10-15 minutes after creating an account." },
              { q: "Is my data secure?", a: "We use enterprise-grade encryption and daily backups to ensure your business data is always safe." },
              { q: "Can I manage multiple locations?", a: "Yes, our Enterprise plan allows you to manage an unlimited number of stations from one dashboard." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border">
                <h5 className="font-bold text-lg mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center text-sm">Q</span>
                  {item.q}
                </h5>
                <p className="text-muted-foreground text-sm pl-11">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-black text-orange-600 uppercase tracking-[0.2em] mb-4">Precision Control</h2>
            <h3 className="text-4xl font-bold mb-6">Engineered for Efficiency</h3>
            <p className="text-muted-foreground">Every feature is designed to give you complete visibility into your business, from the underground tanks to the point of sale.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Fuel,
                title: "Live Inventory Tracking",
                desc: "Monitor fuel levels in real-time with digital tank gauges and automated low-stock alerts.",
                color: "text-orange-500",
                bg: "bg-orange-500/10"
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                desc: "Visualize your revenue trend, sales breakdown, and profit margins with beautiful interactive charts.",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                icon: ShieldCheck,
                title: "Role-Based Security",
                desc: "Dedicated dashboards for Admins, Cashiers, and Sellers with strict permission control.",
                color: "text-green-500",
                bg: "bg-green-500/10"
              },
              {
                icon: Smartphone,
                title: "Mobile First Design",
                desc: "Access your station data from anywhere. Our platform is fully responsive and optimized for mobile.",
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              {
                icon: Zap,
                title: "Instant Transactions",
                desc: "Fast and reliable POS system for cashiers to handle sales and generate PDF receipts instantly.",
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              },
              {
                icon: Globe,
                title: "Multi-Station Support",
                desc: "Manage multiple branches from a single super-admin account with unified reporting.",
                color: "text-cyan-500",
                bg: "bg-cyan-500/10"
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-card border border-border/50 hover:border-orange-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-orange-500/5">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", f.bg)}>
                  <f.icon className={cn("w-7 h-7", f.color)} />
                </div>
                <h4 className="text-xl font-bold mb-3">{f.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 overflow-hidden relative">
        <div className="absolute inset-0 bg-orange-600 -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
            Ready to Transform Your <br /> Fuel Station?
          </h2>
          <p className="text-orange-100 text-lg mb-12 max-w-2xl mx-auto font-medium">
            Join the leading fuel stations in Somalia using Nirig Gas to automate their workflow. 
            Setup takes less than 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-orange-600 font-black text-lg hover:bg-orange-50 transition-all shadow-2xl"
            >
              Start Your Free Trial
            </Link>
            <button className="flex items-center gap-2 font-bold text-lg hover:gap-4 transition-all">
              Talk to an Expert <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight uppercase">NIRIG GAS</span>
              </div>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Empowering fuel station owners with cutting-edge technology for better efficiency, 
                security, and profitability.
              </p>
            </div>
            
            <div>
              <h5 className="font-bold mb-6">Product</h5>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Updates</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6">Company</h5>
              <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                <li><a href="#" className="hover:text-orange-600 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-border gap-6">
            <p className="text-sm text-muted-foreground">
              © 2024 Nirig Gas System. Built with ❤️ for the future of Somalia.
            </p>
            <div className="flex items-center gap-6">
              {["Twitter", "LinkedIn", "Instagram"].map(s => (
                <a key={s} href="#" className="text-xs font-bold text-muted-foreground hover:text-orange-600 transition-colors uppercase tracking-widest">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper component for mockup
function TrendingUp(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
