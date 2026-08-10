"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Megaphone, X, MessageSquare, Mail, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { MarketingCampaignApiItem } from "@/lib/api/types";

interface CampaignDetailsModalProps {
  campaign: MarketingCampaignApiItem | null;
  onClose: () => void;
}

export function CampaignDetailsModal({ campaign, onClose }: CampaignDetailsModalProps) {
  const t = useTranslations("Marketing");
  const locale = useLocale();

  if (!campaign) return null;

  const getChannelBadge = (channel: string) => {
    const ch = channel.toLowerCase();
    if (ch.includes("whatsapp")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <MessageSquare className="size-3.5" />
          {t("channelWhatsApp")}
        </span>
      );
    }
    if (ch.includes("mail") || ch.includes("email")) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <Mail className="size-3.5" />
          {t("channelEmail")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
        <Send className="size-3.5" />
        {channel}
      </span>
    );
  };

  const getStatusBadge = (status?: string) => {
    const st = (status || "draft").toLowerCase();
    switch (st) {
      case "active":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="size-3" />
            {t("statusActive")}
          </span>
        );
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Clock className="size-3" />
            {t("statusScheduled")}
          </span>
        );
      case "draft":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <AlertCircle className="size-3" />
            {t("statusDraft")}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pe-8">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Megaphone className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{campaign.campaign_name}</h3>
            <div className="text-xs text-muted-foreground">ID: #{campaign.id}</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          {getChannelBadge(campaign.channel)}
          {getStatusBadge(campaign.status)}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
            <div className="text-muted-foreground text-[10px]">{t("targetCountry")}</div>
            <div className="font-semibold text-foreground mt-0.5">
              {campaign.target_country || t("allCountries")}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
            <div className="text-muted-foreground text-[10px]">{t("targetCity")}</div>
            <div className="font-semibold text-foreground mt-0.5">
              {campaign.target_city || t("allCities")}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
            <div className="text-muted-foreground text-[10px]">{t("sentCount", { count: "" }).replace(":", "")}</div>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {campaign.sent_count ?? 0}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
            <div className="text-muted-foreground text-[10px]">{t("createdAt", { date: "" }).replace(":", "")}</div>
            <div className="font-semibold text-foreground mt-0.5">
              {campaign.created_at
                ? new Date(campaign.created_at).toLocaleString(locale)
                : "—"}
            </div>
          </div>
        </div>

        {/* Full Message */}
        {campaign.message_body && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">{t("messageBody")}</label>
            <div className="p-3.5 rounded-xl bg-muted/80 border border-border text-xs text-foreground font-sans whitespace-pre-wrap leading-relaxed">
              {campaign.message_body}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-muted/80 transition-colors cursor-pointer"
          >
            {locale === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
