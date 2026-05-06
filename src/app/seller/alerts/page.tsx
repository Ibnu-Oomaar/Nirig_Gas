import { Header } from "@/components/layout/Header";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AlertCircle, Bell, Info, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const alertIcons: Record<string, any> = {
  LOW_STOCK: TrendingDown,
  PRICE_CHANGE: TrendingDown,
  EXPIRY: AlertCircle,
  SYSTEM: Info,
};

const alertColors: Record<string, string> = {
  LOW_STOCK: "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800",
  PRICE_CHANGE: "border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800",
  EXPIRY: "border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800",
  SYSTEM: "border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800",
};

const alertDotColors: Record<string, string> = {
  LOW_STOCK: "bg-red-500",
  PRICE_CHANGE: "bg-amber-500",
  EXPIRY: "bg-purple-500",
  SYSTEM: "bg-blue-500",
};

export default async function SellerAlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true } } },
  });

  const unread = alerts.filter(a => !a.isRead).length;

  return (
    <div>
      <Header title="Alerts" subtitle="System notifications and stock warnings" />
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-card border border-border px-4 py-2 text-sm">
            <span className="text-muted-foreground">Total: </span><span className="font-bold">{alerts.length}</span>
          </div>
          <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-2 text-sm">
            <span className="text-red-600">Unread: </span><span className="font-bold text-red-600">{unread}</span>
          </div>
        </div>

        {alerts.length === 0 && (
          <div className="py-20 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">No alerts at this time</p>
          </div>
        )}

        <div className="space-y-3">
          {alerts.map(alert => {
            const Icon = alertIcons[alert.type] || Bell;
            return (
              <div key={alert.id} className={cn("rounded-xl border p-4 flex items-start gap-4", alertColors[alert.type] || "border-border bg-card", !alert.isRead && "shadow-sm")}>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                  alert.type === "LOW_STOCK" ? "bg-red-100 dark:bg-red-900/40" :
                  alert.type === "PRICE_CHANGE" ? "bg-amber-100 dark:bg-amber-900/40" :
                  alert.type === "SYSTEM" ? "bg-blue-100 dark:bg-blue-900/40" : "bg-purple-100 dark:bg-purple-900/40"
                )}>
                  <Icon className={cn("w-4 h-4",
                    alert.type === "LOW_STOCK" ? "text-red-600" :
                    alert.type === "PRICE_CHANGE" ? "text-amber-600" :
                    alert.type === "SYSTEM" ? "text-blue-600" : "text-purple-600"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm">{alert.title}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!alert.isRead && (
                        <span className={cn("w-2 h-2 rounded-full", alertDotColors[alert.type])} />
                      )}
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold",
                        alert.type === "LOW_STOCK" ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400" :
                        alert.type === "SYSTEM" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" :
                        "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                      )}>{alert.type.replace("_", " ")}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-[10px] text-muted-foreground">{formatDate(alert.createdAt)}</p>
                    <p className="text-[10px] text-muted-foreground">By: {alert.createdBy.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
