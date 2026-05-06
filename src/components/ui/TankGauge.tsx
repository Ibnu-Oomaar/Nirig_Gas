"use client";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

interface TankGaugeProps {
  name: string;
  fuelType: string;
  currentStock: number;
  tankCapacity: number;
  minimumStock: number;
  tankNumber?: string | null;
  sellingPrice: number;
  unit?: string;
}

const fuelColors: Record<string, { fill: string; bg: string; text: string; border: string }> = {
  PETROL:   { fill: "bg-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  DIESEL:   { fill: "bg-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/30",     text: "text-blue-700 dark:text-blue-400",     border: "border-blue-200 dark:border-blue-800" },
  KEROSENE: { fill: "bg-amber-500",  bg: "bg-amber-50 dark:bg-amber-950/30",   text: "text-amber-700 dark:text-amber-400",   border: "border-amber-200 dark:border-amber-800" },
  LPG:      { fill: "bg-green-500",  bg: "bg-green-50 dark:bg-green-950/30",   text: "text-green-700 dark:text-green-400",   border: "border-green-200 dark:border-green-800" },
};

export function TankGauge({ name, fuelType, currentStock, tankCapacity, minimumStock, tankNumber, sellingPrice, unit = "L" }: TankGaugeProps) {
  const pct = Math.min(100, Math.round((currentStock / tankCapacity) * 100));
  const isLow = currentStock <= minimumStock;
  const isCritical = currentStock <= minimumStock * 0.5;
  const colors = fuelColors[fuelType] || fuelColors.PETROL;

  return (
    <div className={cn("rounded-xl border p-5 space-y-4", colors.bg, colors.border)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{tankNumber || "—"}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isCritical && (
            <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/40 text-red-600 px-2 py-0.5 rounded-full">CRITICAL</span>
          )}
          {isLow && !isCritical && (
            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-600 px-2 py-0.5 rounded-full">LOW</span>
          )}
          <span className={cn("text-xs font-bold", colors.text)}>${sellingPrice.toFixed(3)}/{unit}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Stock Level</span>
          <span className={cn("font-bold", isCritical ? "text-red-600" : isLow ? "text-amber-600" : colors.text)}>{pct}%</span>
        </div>
        <div className="h-3 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", isCritical ? "bg-red-500" : isLow ? "bg-amber-500" : colors.fill)}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatNumber(Math.round(currentStock))} {unit}</span>
          <span>{formatNumber(Math.round(tankCapacity))} {unit} cap.</span>
        </div>
      </div>

      {/* Min stock indicator */}
      <div className="flex items-center justify-between pt-1 border-t border-current/10">
        <span className="text-xs text-muted-foreground">Min. threshold</span>
        <span className="text-xs font-medium">{formatNumber(minimumStock)} {unit}</span>
      </div>
    </div>
  );
}
