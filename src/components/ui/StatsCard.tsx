import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "default" | "orange" | "blue" | "green" | "red";
}

const variants = {
  default: { bg: "bg-card", icon: "bg-muted text-muted-foreground", border: "border-border" },
  orange: { bg: "bg-orange-50 dark:bg-orange-950/20", icon: "bg-orange-100 dark:bg-orange-900/40 text-orange-600", border: "border-orange-200 dark:border-orange-800" },
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/20", icon: "bg-blue-100 dark:bg-blue-900/40 text-blue-600", border: "border-blue-200 dark:border-blue-800" },
  green:  { bg: "bg-green-50 dark:bg-green-950/20", icon: "bg-green-100 dark:bg-green-900/40 text-green-600", border: "border-green-200 dark:border-green-800" },
  red:    { bg: "bg-red-50 dark:bg-red-950/20", icon: "bg-red-100 dark:bg-red-900/40 text-red-600", border: "border-red-200 dark:border-red-800" },
};

export function StatsCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatsCardProps) {
  const v = variants[variant];
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <div className={cn("rounded-xl border p-5 space-y-3", v.bg, v.border)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", v.icon)}>
          <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {trend && (
        <p className={cn("text-xs font-medium", isPositive ? "text-green-600" : "text-red-500")}>
          {isPositive ? "▲" : "▼"} {Math.abs(trend.value)}% {trend.label}
        </p>
      )}
    </div>
  );
}
