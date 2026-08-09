"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages, User, LogOut, Shield } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { useAuth } from "@/lib/auth-context";
export function SiteHeader() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-ink"
        >
          <Logo className="size-8" />
          {t("logo")}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link
            href="/#pricing"
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === "/" && "text-foreground"
            )}
          >
            {t("secure")}
          </Link>
          <Link
            href="/gallery"
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === "/gallery" && "text-foreground font-semibold"
            )}
          >
            {t("gallery")}
          </Link>
          <Link
            href="/bundles"
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === "/bundles" && "text-foreground font-semibold"
            )}
          >
            {t("bundles")}
          </Link>
          <Link
            href="/blog"
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === "/blog" && "text-foreground font-semibold"
            )}
          >
            {t("blog")}
          </Link>
          <Link
            href="/support"
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === "/support" && "text-foreground font-semibold"
            )}
          >
            {t("support")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "gap-1.5"
              )}
            >
              <Languages className="size-4" />
              <span className="hidden sm:inline">{t("language")}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {routing.locales.map((l) => (
                <DropdownMenuItem
                  key={l}
                  className={cn(locale === l && "bg-accent")}
                >
                  <Link href={pathname} locale={l as Locale} className="w-full">
                    {l === "ar" ? t("arabic") : t("english")}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full gap-1.5 px-3 border-primary/30"
                )}
              >
                <div className="size-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="max-w-[100px] truncate font-bold text-xs">
                  {user?.name || "المستخدم"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer font-bold w-full">
                    <Shield className="size-4 text-primary" />
                    لوحة التحكم
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer w-full">
                    <User className="size-4" />
                    الملف الشخصي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <LogOut className="size-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "rounded-full px-4"
              )}
            >
              {t("subscribe")}
            </Link>
          )}

          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full px-4 hidden sm:inline-flex")}
          >
            {t("dashboard")}
          </Link>
        </div>
      </div>
    </header>
  );
}
