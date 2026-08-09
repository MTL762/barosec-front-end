"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Camera,
  ShieldAlert,
  CreditCard,
  User,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  Shield,
  Wifi,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    exact: true,
    icon: LayoutDashboard,
    label: "نظرة عامة",
    labelEn: "Overview",
  },
  {
    href: "/dashboard/cameras",
    icon: Camera,
    label: "الكاميرات",
    labelEn: "Cameras",
  },
  {
    href: "/dashboard/emergency",
    icon: ShieldAlert,
    label: "الطوارئ",
    labelEn: "Emergency",
    danger: true,
  },
  {
    href: "/dashboard/billing",
    icon: CreditCard,
    label: "الفواتير",
    labelEn: "Billing",
  },
  {
    href: "/dashboard/profile",
    icon: User,
    label: "الملف الشخصي",
    labelEn: "Profile",
  },
  {
    href: "/dashboard/admin",
    icon: Shield,
    label: "لوحة الأدمن و APIs",
    labelEn: "Admin & APIs",
  },
];

function NavLink({
  item,
  collapsed,
  mobile = false,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[0];
  collapsed: boolean;
  mobile?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href || pathname.endsWith(item.href)
    : pathname.includes(item.href);

  const Icon = item.icon;

  if (mobile) {
    return (
      <a
        href={item.href}
        onClick={onClick}
        className={cn(
          "flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-bold transition-all duration-200",
          isActive
            ? item.danger
              ? "text-red-500 dark:text-red-400"
              : "text-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon
          className={cn(
            "size-5 transition-transform duration-200",
            isActive && "scale-110",
            item.danger && isActive && "animate-pulse"
          )}
        />
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <a
      href={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 select-none",
        isActive
          ? item.danger
            ? "bg-red-500/10 text-red-600 dark:text-red-400"
            : "bg-primary/10 text-primary"
          : item.danger
          ? "text-muted-foreground hover:bg-red-500/8 hover:text-red-600 dark:hover:text-red-400"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {isActive && (
        <span
          className={cn(
            "absolute inset-y-1 start-0 w-0.5 rounded-full",
            item.danger ? "bg-red-500" : "bg-primary"
          )}
        />
      )}
      <Icon
        className={cn(
          "size-4 shrink-0 transition-transform duration-200",
          isActive && "scale-110",
          item.danger && isActive && "animate-pulse"
        )}
      />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
      {collapsed && (
        <span className="pointer-events-none absolute start-full ms-2 z-50 whitespace-nowrap rounded-lg bg-popover text-popover-foreground border border-border px-2.5 py-1.5 text-xs font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {item.label}
        </span>
      )}
    </a>
  );
}

function getPageTitle(pathname: string): { ar: string; en: string } {
  if (pathname.includes("/cameras")) return { ar: "إدارة الكاميرات", en: "Cameras" };
  if (pathname.includes("/emergency")) return { ar: "مركز الطوارئ", en: "Emergency" };
  if (pathname.includes("/billing")) return { ar: "الفواتير والاشتراكات", en: "Billing" };
  if (pathname.includes("/profile")) return { ar: "الملف الشخصي", en: "Profile" };
  return { ar: "نظرة عامة", en: "Overview" };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isEmergency = pathname.includes("/emergency");

  return (
    <div className="flex h-screen overflow-hidden bg-[--db-bg] text-foreground">
      {/* ── Sidebar (desktop) ───────────────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-full shrink-0 transition-[width] duration-300 ease-out-expo bg-[--db-sidebar] border-e border-[--db-border] overflow-hidden",
          collapsed ? "w-[68px]" : "w-[220px]"
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex items-center gap-2.5 px-4 py-5 border-b border-[--db-border] shrink-0",
            collapsed && "justify-center px-2"
          )}
        >
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Shield className="size-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-foreground leading-none">باروسك</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Secure Home</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Bottom: status + collapse toggle */}
        <div className="shrink-0 border-t border-[--db-border] p-2 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/8 text-emerald-600 dark:text-emerald-400">
              <Wifi className="size-3.5 shrink-0" />
              <span className="text-[10px] font-bold">3 كاميرات متصلة</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="w-full flex items-center justify-center h-8 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronLeft className="size-4 rtl:rotate-180" />
            ) : (
              <ChevronRight className="size-4 rtl:rotate-180" />
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────── */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 start-0 z-50 flex flex-col w-64 bg-[--db-sidebar] border-e border-[--db-border] transition-transform duration-300 ease-out-expo",
          mobileOpen ? "translate-x-0 rtl:translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-[--db-border]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Shield className="size-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground leading-none">باروسك</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Secure Home</div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={false}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <div className="shrink-0 border-t border-[--db-border] p-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/8 text-emerald-600 dark:text-emerald-400">
            <Wifi className="size-3.5 shrink-0" />
            <span className="text-xs font-bold">3 كاميرات متصلة</span>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header
          className={cn(
            "h-14 shrink-0 flex items-center gap-3 px-4 sm:px-6 border-b border-[--db-border] bg-[--db-sidebar] z-20",
            isEmergency && "border-red-500/20"
          )}
        >
          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-accent"
          >
            <Menu className="size-5" />
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {isEmergency && (
                <span className="hidden sm:flex size-2 rounded-full bg-red-500 animate-pulse" />
              )}
              <h1 className="text-sm font-bold text-foreground truncate">{title.ar}</h1>
              <span className="hidden sm:block text-xs text-muted-foreground">/</span>
              <span className="hidden sm:block text-xs text-muted-foreground font-mono">{title.en}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button className="relative p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Bell className="size-4" />
              <span className="absolute top-1.5 end-1.5 size-1.5 rounded-full bg-red-500" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            <div className="ms-1 size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors">
              م.ب
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 pb-24 lg:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile bottom nav ───────────────────────────── */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 z-30 flex items-center justify-around bg-[--db-sidebar] border-t border-[--db-border] px-2 py-1.5 safe-area-bottom">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} collapsed={false} mobile />
        ))}
      </nav>
    </div>
  );
}
