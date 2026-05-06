import { Header } from "@/components/layout/Header";
import { Settings, Building2, Bell, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <Header title="Settings" subtitle="System configuration and preferences" />
      <div className="p-6 space-y-6">
        {/* Station Info */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Building2 className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold">Station Information</h3>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4">
            {[
              { label: "Station Name", value: "Nirig Gas & Fuel Station", type: "text" },
              { label: "Owner Name", value: "Nirig Holdings Ltd.", type: "text" },
              { label: "Phone", value: "+252 61 234 5678", type: "tel" },
              { label: "Email", value: "info@niriggas.com", type: "email" },
              { label: "Address", value: "Hargeisa, Somaliland", type: "text" },
              { label: "Tax ID", value: "SOM-2024-0001", type: "text" },
            ].map((f) => (
              <div key={f.label} className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{f.label}</label>
                <input type={f.type} defaultValue={f.value}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <button className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition">
              Save Changes
            </button>
          </div>
        </div>

        {/* Low Stock Thresholds */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Bell className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold">Alert Thresholds</h3>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: "Low Stock Alert at (%)", value: "20" },
              { label: "Critical Stock Alert at (%)", value: "10" },
              { label: "Auto-alert Email", value: "admin@niriggas.com" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground w-56">{f.label}</label>
                <input defaultValue={f.value}
                  className="h-9 px-3 rounded-lg border border-input bg-background text-sm w-56 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Shield className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold">Security</h3>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: "Session Timeout (minutes)", value: "60" },
              { label: "Max Login Attempts", value: "5" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground w-56">{f.label}</label>
                <input type="number" defaultValue={f.value}
                  className="h-9 px-3 rounded-lg border border-input bg-background text-sm w-32 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            ))}
          </div>
        </div>

        {/* DB Info */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 p-5 border-b border-border">
            <Database className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-semibold">Database</h3>
          </div>
          <div className="p-5 grid grid-cols-3 gap-4">
            {[
              { label: "Engine", value: "PostgreSQL 16" },
              { label: "ORM", value: "Prisma 5" },
              { label: "Status", value: "Connected ✓" },
            ].map((i) => (
              <div key={i.label} className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">{i.label}</p>
                <p className="font-semibold text-sm mt-1">{i.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
