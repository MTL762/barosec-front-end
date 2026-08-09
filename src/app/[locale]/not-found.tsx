"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "@/components/secure/site-header";
import { SiteFooter } from "@/components/secure/site-footer";
import { EyeOff, Home, HelpCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const t = useTranslations("Errors");

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative">
        {/* Decorative Grid background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

        {/* Ambient Hero Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-20 dark:opacity-30"
          style={{
            background: "radial-gradient(circle 500px at 50% 40%, var(--hero-glow), transparent 70%)",
          }}
        />

        <div className="relative mb-6">
          {/* Pulsing signal offline rings */}
          <div className="absolute inset-0 -m-6 animate-ping rounded-full border border-destructive/20 opacity-40 [animation-duration:2.5s]" />
          <div className="relative rounded-2xl bg-card border border-border/80 p-6 shadow-2xl flex items-center justify-center text-muted-foreground">
            <EyeOff className="size-16 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive"></span>
            </span>
          </div>
        </div>

        <span className="text-sm font-bold uppercase tracking-wider text-destructive mb-2">
          404 Error
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-ink font-heading sm:text-4xl mb-4">
          {t("notFoundTitle")}
        </h1>
        
        <p className="max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed mb-8">
          {t("notFoundSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "rounded-full font-semibold gap-2 transition-all duration-300 hover:scale-[1.02]"
            )}
          >
            <Home className="size-4" />
            <span>{t("goHome")}</span>
          </Link>
          <Link
            href="/support"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full font-semibold gap-2 transition-all duration-300 hover:scale-[1.02]"
            )}
          >
            <HelpCircle className="size-4" />
            <span>{t("goSupport")}</span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
