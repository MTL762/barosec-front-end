"use client";

import { useTranslations } from "next-intl";
import { Loader2, Shield } from "lucide-react";

export default function Loading() {
  const t = useTranslations("Errors");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Background Decorative Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-20 dark:opacity-30"
        style={{
          background: "radial-gradient(circle 500px at 50% 40%, var(--hero-glow), transparent 70%)",
        }}
      />

      <div className="relative flex items-center justify-center mb-8">
        {/* Concentric radar pulsing rings */}
        <div className="absolute inset-0 -m-8 animate-ping rounded-full border border-primary/20 opacity-75 [animation-duration:3s]" />
        <div className="absolute inset-0 -m-4 animate-pulse rounded-full border border-primary/30 opacity-50 [animation-duration:2s]" />

        {/* Central Hexagon Shield Container */}
        <div className="relative rounded-2xl bg-card border border-border/80 p-5 shadow-2xl shadow-primary/5 flex items-center justify-center">
          <Shield className="size-10 text-primary animate-pulse" />
          <Loader2 className="absolute size-14 text-primary/40 animate-spin" />
        </div>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-ink font-heading sm:text-2xl mb-2">
        {t("loading")}
      </h2>
      <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
        {t("loadingSubtitle")}
      </p>

      {/* Shimmer wireframe mockups to give the user a feeling of content arriving */}
      <div className="w-full max-w-md mt-10 space-y-4">
        <div className="h-4 bg-muted animate-pulse rounded-full w-3/4 mx-auto" />
        <div className="h-3 bg-muted/60 animate-pulse rounded-full w-1/2 mx-auto" />
        <div className="h-3 bg-muted/40 animate-pulse rounded-full w-2/3 mx-auto" />
      </div>
    </div>
  );
}
