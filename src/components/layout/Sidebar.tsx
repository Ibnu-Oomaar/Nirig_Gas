"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck,
  BarChart2, Settings, LogOut, Flame, ChevronRight,
  Receipt, AlertCircle, DollarSign, Layers, History,
  RefreshCw, Download, Bell, Sun, Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem { label: string; href: string; icon: React.ElementType }

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
  { label: "Restock Fuel", href: "/admin/restock", icon: RefreshCw },
  { label: "Transactions", href: "/admin/transactions", icon: Receipt },
  { label: "Payments", href: "/admin/payments", icon: DollarSign },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Suppliers", href: "/admin/suppliers", icon: Truck },
  { label: "Expenses", href: "/admin/expenses", icon: DollarSign },
  { label: "Reports", href: "/admin/reports", icon: BarChart2 },
  { label: "Stock History", href: "/admin/stock-history", icon: History },
  { label: "Users", href: "/admin/users", icon: Layers },
  { label: "Export Data", href: "/admin/export", icon: Download },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const cashierNav: NavItem[] = [
  { label: "Dashboard", href: "/cashier", icon: LayoutDashboard },
  { label: "New Sale", href: "/cashier/sale", icon: ShoppingCart },
  { label: "Transactions", href: "/cashier/transactions", icon: Receipt },
  { label: "Payments", href: "/cashier/payments", icon: DollarSign },
  { label: "Customers", href: "/cashier/customers", icon: Users },
  { label: "Inventory", href: "/cashier/inventory", icon: Package },
  { label: "Shift Report", href: "/cashier/shift", icon: BarChart2 },
];

const sellerNav: NavItem[] = [
  { label: "Dashboard", href: "/seller", icon: LayoutDashboard },
  { label: "Inventory", href: "/seller/inventory", icon: Package },
  { label: "Payments", href: "/seller/payments", icon: DollarSign },
  { label: "Alerts", href: "/seller/alerts", icon: AlertCircle },
];

const navMap: Record<string, NavItem[]> = {
  admin: adminNav, cashier: cashierNav, seller: sellerNav,
};

interface SidebarProps { role: string; userName: string; userEmail: string; }

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const nav = navMap[role.toLowerCase()] || [];
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={cn(
      "shrink-0 h-screen sticky top-0 flex flex-col transition-all duration-300",
      isCollapsed ? "w-24" : "w-80"
    )}>
      {/* Main Sidebar Container with Glass Effect and Rounded Corners */}
      <div className="flex-1 flex flex-col m-4 rounded-3xl bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 shadow-2xl backdrop-blur-sm overflow-hidden">
        
        {/* Header Section with Rounded Top */}
        <div className={cn(
          "relative flex items-center gap-4 px-6 py-5 border-b border-border/50 bg-gradient-to-r from-orange-600/10 to-transparent",
          isCollapsed ? "justify-center px-3" : ""
        )}>
          {/* Animated Flame Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-orange-600/20 rounded-xl blur-xl animate-pulse" />
            <div className={cn(
              "relative rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg transition-all duration-300",
              isCollapsed ? "w-12 h-12" : "w-10 h-10"
            )}>
              <Flame className={cn(
                "text-white transition-all duration-300",
                isCollapsed ? "w-6 h-6" : "w-5 h-5",
                "hover:rotate-12"
              )} />
            </div>
          </div>
          
          {!isCollapsed && (
            <div className="flex-1">
              <p className="font-bold text-lg leading-none tracking-wide bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                NIRIG GAS
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5 capitalize">
                {role.toLowerCase()} panel
              </p>
            </div>
          )}
          
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-border border-2 border-background flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all group shadow-md",
              isCollapsed && "rotate-180"
            )}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Navigation Section with Scroll */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
          {nav.map((item, index) => {
            const isActive = pathname === item.href ||
              (item.href !== `/${role.toLowerCase()}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-600/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  isCollapsed ? "justify-center px-2" : ""
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
                
                <item.icon className={cn(
                  "shrink-0 transition-all duration-200",
                  isCollapsed ? "w-6 h-6" : "w-5 h-5",
                  isActive && "scale-110",
                  !isActive && "group-hover:scale-110"
                )} />
                
                {!isCollapsed && (
                  <span className="flex-1 text-base">{item.label}</span>
                )}
                
                {isActive && !isCollapsed && (
                  <ChevronRight className="w-4 h-4 opacity-60" />
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section with Rounded Bottom */}
        <div className="border-t border-border/50 p-4 mt-auto">
          <div className={cn(
            "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-accent/50 group",
            isCollapsed ? "justify-center px-2" : ""
          )}>
            {/* Animated Avatar */}
            <div className="relative">
              <div className={cn(
                "rounded-xl flex items-center justify-center font-bold text-white shrink-0 transition-all duration-300",
                role === "ADMIN" 
                  ? "bg-gradient-to-br from-orange-500 to-orange-600" 
                  : role === "CASHIER" 
                    ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                    : "bg-gradient-to-br from-green-500 to-green-600",
                isCollapsed ? "w-12 h-12 text-lg" : "w-10 h-10 text-base"
              )}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{userEmail}</p>
              </div>
            )}
            
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign out"
              className={cn(
                "text-muted-foreground hover:text-destructive transition-all p-2 rounded-lg hover:bg-destructive/10",
                isCollapsed && "mt-1"
              )}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          
          {/* Status Badge for Collapsed State */}
          {isCollapsed && (
            <div className="mt-3 flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}