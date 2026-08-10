"use client";

import React from "react";
import CustomForm from "@/components/shared/Form/custom-form";
import useAuthFormLogic from "./useAuthForm.logic";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/secure/logo";
import { AlertCircle, LogIn, UserPlus, ArrowRight } from "lucide-react";

export default function AuthFormPage() {
  const { mode, setMode, control, inputs, formSubmit, error, t } = useAuthFormLogic();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.55_0.11_200_/_0.12)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.55_0.15_150_/_0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity"
          >
            <Logo className="size-9" />
            <span>Barosec</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "login" ? t("loginTitle") : t("registerTitle")}
          </h1>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {mode === "login" ? t("loginSubtitle") : t("registerSubtitle")}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="size-3.5" />
              <span>{t("loginTitle")}</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "register"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus className="size-3.5" />
              <span>{t("registerTitle")}</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <CustomForm
            handleSubmit={formSubmit}
            control={control}
            btnLabel={mode === "login" ? t("loginButton") : t("registerButton")}
            cardConfig={[
              {
                id: "default",
                width: 6,
              },
            ]}
            inputs={inputs}
          />

          {/* Footer toggle */}
          <div className="text-center pt-2 text-xs text-muted-foreground space-y-2">
            <div>
              {mode === "login" ? (
                <span>
                  {t("noAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-bold text-primary hover:underline"
                  >
                    {t("createAccountNow")}
                  </button>
                </span>
              ) : (
                <span>
                  {t("hasAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-primary hover:underline"
                  >
                    {t("loginButton")}
                  </button>
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-border/50 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <span>هل أنت أدمن بالنظام؟</span>
              <Link href="/admin/login" className="font-bold text-primary hover:underline">
                تسجيل دخول المسؤولين (Admin Portal)
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="size-3.5 rtl:rotate-180" />
            <span>{t("backToHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
