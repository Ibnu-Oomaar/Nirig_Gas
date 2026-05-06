"use client";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Menu, Sparkles, ChevronRight, User } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function Header({ title, subtitle, showMenu, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="h-16 border-b border-border/50 bg-gradient-to-r from-card/95 via-card/90 to-card/95 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 shadow-sm">
      {/* Animated Gradient Border Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Menu Button (Optional) */}
        {showMenu && (
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-xl hover:bg-accent/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 group"
          >
            <Menu className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        )}
        
        {/* Title Section with Icon */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1 h-1 rounded-full bg-primary" />
                <p className="text-[11px] text-muted-foreground font-medium">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-1">
        {/* Quick Action - Dashboard Link */}
        <div className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-accent/30 border border-border/30">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Live
          </span>
        </div>

        {/* Notifications Button with Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-xl hover:bg-accent/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 group"
          >
            <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background animate-pulse" />
          </button>
          
          {/* Notification Dropdown (Optional) */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-semibold">Notifications</p>
              </div>
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle with Animation */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative w-9 h-9 rounded-xl hover:bg-accent/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {theme === "dark" ? (
              <Sun className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 relative z-10 group-hover:-rotate-90 transition-transform duration-300" />
            )}
          </button>
        )}

        {/* User Avatar (Quick Access) */}
        <button className="ml-2 w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center hover:scale-105 transition-transform duration-200">
          <User className="w-4 h-4 text-primary" />
        </button>
      </div>

      {/* Subtle Bottom Shadow on Scroll */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
    </header>
  );
}