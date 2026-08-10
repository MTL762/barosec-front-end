"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Globe,
  MapPin,
  Eye,
  Copy,
  Check,
} from "lucide-react";
import type { MarketingCampaignApiItem } from "@/lib/api/types";

interface CampaignCardProps {
  campaign: MarketingCampaignApiItem;
  onSelect: (campaign: MarketingCampaignApiItem) => void;
}

export function CampaignCard({ campaign, onSelect }: CampaignCardProps) {
  const t = useTranslations("Marketing");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const copyMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (campaign.message_body) {
      navigator.clipboard.writeText(campaign.message_body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <div className="db-card p-5 border border-border/70 rounded-2xl hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group bg-card">
      <div className="space-y-3">
        {/* Badges & Status */}
        <div className="flex items-center justify-between gap-2">
          {getChannelBadge(campaign.channel)}
          {getStatusBadge(campaign.status)}
        </div>

        {/* Campaign Title */}
        <div>
          <h3 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {campaign.campaign_name}
          </h3>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="size-3 text-muted-foreground" />
            <span>
              {campaign.created_at
                ? new Date(campaign.created_at).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : t("createdAt", { date: "—" })}
            </span>
          </div>
        </div>

        {/* Location & Count Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] bg-muted text-muted-foreground border border-border">
            <Globe className="size-3 text-primary" />
            {campaign.target_country || t("allCountries")}
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] bg-muted text-muted-foreground border border-border">
            <MapPin className="size-3 text-primary" />
            {campaign.target_city || t("allCities")}
          </span>

          {campaign.sent_count !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono font-bold">
              {t("sentCount", { count: campaign.sent_count })}
            </span>
          )}
        </div>

        {/* Message Preview */}
        {campaign.message_body && (
          <div className="p-3 rounded-xl bg-muted/60 border border-border/50 text-xs text-foreground/90 font-sans line-clamp-3">
            {campaign.message_body}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(campaign)}
          className="px-3 py-1.5 rounded-xl border border-border text-[11px] font-semibold text-foreground hover:bg-muted hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Eye className="size-3.5" />
          <span>{t("viewDetails")}</span>
        </button>

        {campaign.message_body && (
          <button
            onClick={copyMessage}
            className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title={t("copyMessage")}
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-500" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
