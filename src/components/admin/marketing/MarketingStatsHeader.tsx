"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Megaphone,
  Send,
  Plus,
  Clock,
  CheckCircle2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketingStatsHeaderProps {
  activeTab: "campaigns" | "dispatch" | "create";
  setActiveTab: (tab: "campaigns" | "dispatch" | "create") => void;
  totalCampaigns: number;
  draftCount: number;
  activeCount: number;
  totalSentCount: number;
}

export function MarketingStatsHeader({
  activeTab,
  setActiveTab,
  totalCampaigns,
  draftCount,
  activeCount,
  totalSentCount,
}: MarketingStatsHeaderProps) {
  const t = useTranslations("Marketing");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="db-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-background via-background to-primary/5 border border-border/80 shadow-sm rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Megaphone className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">{t("title")}</h1>
              <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("create")}
            className={cn(
              "flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm",
              activeTab === "create"
                ? "bg-primary text-primary-foreground shadow-primary/20"
                : "bg-background border border-border text-foreground hover:bg-muted"
            )}
          >
            <Plus className="size-4" />
            <span>{t("tabCreateCampaign")}</span>
          </button>

          <button
            onClick={() => setActiveTab("dispatch")}
            className={cn(
              "flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm",
              activeTab === "dispatch"
                ? "bg-primary text-primary-foreground shadow-primary/20"
                : "bg-background border border-border text-foreground hover:bg-muted"
            )}
          >
            <Send className="size-4" />
            <span>{t("tabBulkDispatch")}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="db-card p-5 border border-border/70 rounded-2xl flex items-center gap-4 hover:border-primary/40 transition-colors">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Megaphone className="size-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground">{totalCampaigns}</div>
            <div className="text-xs text-muted-foreground font-medium">{t("kpiTotalCampaigns")}</div>
          </div>
        </div>

        <div className="db-card p-5 border border-border/70 rounded-2xl flex items-center gap-4 hover:border-amber-500/40 transition-colors">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="size-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground">{draftCount}</div>
            <div className="text-xs text-muted-foreground font-medium">{t("kpiActiveDrafts")}</div>
          </div>
        </div>

        <div className="db-card p-5 border border-border/70 rounded-2xl flex items-center gap-4 hover:border-emerald-500/40 transition-colors">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground">{activeCount}</div>
            <div className="text-xs text-muted-foreground font-medium">{t("kpiSentBroadcasts")}</div>
          </div>
        </div>

        <div className="db-card p-5 border border-border/70 rounded-2xl flex items-center gap-4 hover:border-sky-500/40 transition-colors">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Users className="size-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-foreground">{totalSentCount}</div>
            <div className="text-xs text-muted-foreground font-medium">{t("kpiTotalReach")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
