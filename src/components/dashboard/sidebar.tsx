"use client";

import { usePathname } from "next/navigation";
import {
  Camera,
  ShieldAlert,
  CreditCard,
  User,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Shield,
  Wifi,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export const NAV_ITEMS = [
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

export function NavLink({
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
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute start-full ms-2 z-50 whitespace-nowrap rounded-lg bg-popover text-popover-foreground border border-border px-2.5 py-1.5 text-xs font-semibold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {item.label}
        </span>
      )}
    </a>
  );
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  cameraCount?: number;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  collapsed,
  setCollapsed,
  cameraCount = 0,
  mobile = false,
  onCloseMobile,
}: SidebarProps) {
  const { user, token, logout } = useAuth();

  const userInitials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "??";

  return (
    <aside
      className={cn(
        "flex flex-col h-full shrink-0 transition-[width] duration-300 ease-out-expo bg-[--db-sidebar] border-e border-[--db-border] overflow-hidden",
        mobile ? "w-64" : collapsed ? "w-[68px]" : "w-[220px]"
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-5 border-b border-[--db-border] shrink-0",
          collapsed && !mobile && "justify-center px-2"
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
            <Shield className="size-4 text-primary-foreground" />
          </div>
          {(!collapsed || mobile) && (
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-foreground leading-none">باروسك</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Secure Home</div>
            </div>
          )}
        </div>

        {mobile && onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={mobile ? false : collapsed}
            onClick={mobile ? onCloseMobile : undefined}
          />
        ))}
      </nav>

      {/* Status + User Profile + Logout */}
      <div className="shrink-0 border-t border-[--db-border] p-2 space-y-2">
        {/* Connection status */}
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/8 text-emerald-600 dark:text-emerald-400">
            <Wifi className="size-3.5 shrink-0" />
            <span className="text-[10px] font-bold">
              {cameraCount > 0 ? `${cameraCount} كاميرات متصلة` : "لا كاميرات مسجلة"}
            </span>
          </div>
        )}

        {/* User Data Card */}
        {user && (
          <div
            title={`${user.name || "مستخدم"} (${user.email})`}
            className={cn(
              "flex items-center gap-2.5 p-2 rounded-xl bg-accent/40 border border-border/40 transition-all",
              collapsed && !mobile && "justify-center p-1.5"
            )}
          >
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {userInitials}
            </div>

            {(!collapsed || mobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {user.name || "مستخدم"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        {token && (
          <button
            onClick={() => {
              if (mobile && onCloseMobile) onCloseMobile();
              logout();
            }}
            title="تسجيل الخروج"
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors",
              collapsed && !mobile && "justify-center px-0"
            )}
          >
            <LogOut className="size-4 shrink-0" />
            {(!collapsed || mobile) && <span>تسجيل الخروج</span>}
          </button>
        )}

        {/* Collapse Toggle */}
        {!mobile && setCollapsed && (
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
        )}
      </div>
    </aside>
  );
}
