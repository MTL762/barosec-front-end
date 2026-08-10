"use client";

import React from "react";
import { Users, ShieldCheck, UserCheck, UserPlus, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { AdminUserApiItem } from "@/lib/api";

interface UsersStatsHeaderProps {
  users: AdminUserApiItem[];
  totalFromMeta?: number;
  onOpenAddModal: () => void;
}

export function UsersStatsHeader({
  users,
  totalFromMeta,
  onOpenAddModal,
}: UsersStatsHeaderProps) {
  const t = useTranslations("AdminUsers");

  const totalCount = totalFromMeta ?? users.length;

  const adminCount = users.filter((u) => {
    if (!u.role) return false;
    if (typeof u.role === "string") return u.role.toLowerCase().includes("admin");
    return u.role.name.toLowerCase().includes("admin");
  }).length;

  const verifiedCount = users.filter((u) => Boolean(u.email_verified_at)).length;

  const activeCount = users.length;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="db-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card text-card-foreground border border-border shadow-sm rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Users className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                <span>{t("title")}</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  /admin/users
                </span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer"
        >
          <UserPlus className="size-4" />
          <span>{t("addUser")}</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Users */}
        <div className="db-card p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-muted-foreground">{t("kpiTotalUsers")}</div>
            <div className="text-xl font-extrabold text-foreground">{totalCount}</div>
          </div>
        </div>

        {/* KPI 2: Admins */}
        <div className="db-card p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-muted-foreground">{t("kpiAdmins")}</div>
            <div className="text-xl font-extrabold text-foreground">{adminCount}</div>
          </div>
        </div>

        {/* KPI 3: Verified Users */}
        <div className="db-card p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UserCheck className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-muted-foreground">{t("kpiVerified")}</div>
            <div className="text-xl font-extrabold text-foreground">{verifiedCount}</div>
          </div>
        </div>

        {/* KPI 4: Active Users */}
        <div className="db-card p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-muted-foreground">{t("kpiActive")}</div>
            <div className="text-xl font-extrabold text-foreground">{activeCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
