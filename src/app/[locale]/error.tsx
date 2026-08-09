"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertOctagon, RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Props) {
  const t = useTranslations("Errors");
  const [showDetails, setShowDetails] = React.useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime App Error Boundary caught exception:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      {/* Background Warning Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-20 dark:opacity-30"
        style={{
          background: "radial-gradient(circle 500px at 50% 40%, oklch(0.55 0.2 25 / 0.15), transparent 70%)",
        }}
      />

      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive animate-bounce">
        <AlertOctagon className="size-10" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-ink font-heading sm:text-3xl mb-3">
        {t("errorTitle")}
      </h1>
      <p className="max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
        {t("errorSubtitle")}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md shadow-primary/10"
        >
          <RefreshCcw className="size-4 animate-spin [animation-duration:8s]" />
          <span>{t("tryAgain")}</span>
        </button>
      </div>

      {/* Technical Diagnostics Details */}
      <div className="mt-12 w-full max-w-lg rounded-xl border border-border bg-card p-4 text-start">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <span>System Diagnostics</span>
          {showDetails ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {showDetails && (
          <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs font-mono text-muted-foreground break-all whitespace-pre-wrap">
            <div>
              <span className="font-bold text-destructive">Message:</span> {error.message || "Unknown Application Exception"}
            </div>
            {error.digest && (
              <div>
                <span className="font-bold text-ink">Digest:</span> {error.digest}
              </div>
            )}
            <div className="text-[10px] text-muted-foreground/60 leading-normal">
              Timestamp: {new Date().toISOString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
