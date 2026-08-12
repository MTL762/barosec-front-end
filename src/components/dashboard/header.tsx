"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Globe, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useLocale } from "next-intl";

interface DashboardHeaderProps {
  title: { ar: string; en: string };
  isEmergency?: boolean;
  onOpenMobileMenu: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export function DashboardHeader({
  title,
  isEmergency = false,
  onOpenMobileMenu,
  isDark,
  toggleTheme,
}: DashboardHeaderProps) {
  const { user, token, logout } = useAuth();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: nextLocale });
  };

  const userInitials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "??";

  return (
    <header
      className={cn(
        "h-14 shrink-0 flex items-center gap-3 px-4 sm:px-6 border-b border-[--db-border] bg-[--db-sidebar] z-20",
        isEmergency && "border-red-500/20"
      )}
    >
      {/* Mobile menu trigger */}
      <button
        onClick={onOpenMobileMenu}
        className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-accent"
        aria-label="Open mobile menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Page Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isEmergency && (
            <span className="hidden sm:flex size-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <h1 className="text-sm font-bold text-foreground truncate">
            {locale === "en" ? title.en : title.ar}
          </h1>
          <span className="hidden sm:block text-xs text-muted-foreground">/</span>
          <span className="hidden sm:block text-xs text-muted-foreground font-mono">
            {locale === "en" ? title.ar : title.en}
          </span>
        </div>
      </div>

      {/* Action Buttons & User Menu */}
      <div className="flex items-center gap-1.5">
        {/* Language Switcher */}
        <button
          onClick={toggleLocale}
          className="p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors flex items-center gap-1 text-xs font-bold font-mono"
          title={locale === "ar" ? "Switch to English" : "التحويل للعربية"}
          aria-label="Toggle language"
        >
          <Globe className="size-4 text-primary" />
          <span>{locale === "ar" ? "EN" : "العربية"}</span>
        </button>

        {/* Notifications */}
        {/* <button
          className="relative p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 end-1.5 size-1.5 rounded-full bg-red-500" />
        </button> */}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title={locale === "ar" ? "تغيير الثيم" : "Toggle Theme"}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        {/* User Badge */}
        {user && (
          <div
            title={`${user.name || "User"} (${user.email})`}
            className="ms-1 size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors"
          >
            {userInitials}
          </div>
        )}

        {/* Logout */}
        {token && (
          <button
            onClick={() => logout()}
            title={locale === "ar" ? "تسجيل الخروج (Logout)" : "Sign Out"}
            className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="size-4" />
          </button>
        )}
      </div>
    </header>
  );
}
