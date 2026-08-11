"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Shield, Lock, Mail, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const t = useTranslations();
  const tAuth = useTranslations("Auth");
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login({ email, password });
    if (res.success) {
      router.push("/dashboard/admin");
    } else {
      setError(res.error || tAuth("loginFailed"));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Dark Cyber Security Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.4_0.18_260_/_0.25)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,oklch(0.55_0.18_150_/_0.15)_0%,transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold font-mono">
            <Shield className="size-4" />
            <span>{t("Admin Security Portal")}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {t("Sign In as Administrator")}
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {t("Protected area for system administrators and API developers")}
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">{t("Admin Email")}</label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@barosec.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">{t("Password")}</label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-3 size-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Shield className="size-4" />
                  <span>{t("Sign In to Admin Dashboard")}</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Client Login */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            {t("Are you a client?")}{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              {t("Client Login")}
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowRight className="size-3.5 rtl:rotate-180" />
            <span>{tAuth("backToHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
