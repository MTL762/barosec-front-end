"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Filter,
  Loader2,
  Megaphone,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { MarketingCampaignApiItem, PaginationMeta } from "@/lib/api/types";
import { CampaignCard } from "./CampaignCard";

interface CampaignsListProps {
  campaigns: MarketingCampaignApiItem[];
  paginationMeta: PaginationMeta | null;
  loading: boolean;
  onSelectCampaign: (c: MarketingCampaignApiItem) => void;
  onPageChange: (page: number) => void;
  onCreateNewClick: () => void;
}

export function CampaignsList({
  campaigns,
  paginationMeta,
  loading,
  onSelectCampaign,
  onPageChange,
  onCreateNewClick,
}: CampaignsListProps) {
  const t = useTranslations("Marketing");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.target_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.target_country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message_body?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChannel =
        selectedChannel === "all" || c.channel.toLowerCase() === selectedChannel.toLowerCase();

      const matchesStatus =
        selectedStatus === "all" || (c.status || "draft").toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [campaigns, searchQuery, selectedChannel, selectedStatus]);

  return (
    <div className="space-y-4">
      {/* Search & Filters Toolbar */}
      <div className="db-card p-4 border border-border/70 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute me-3 text-muted-foreground size-4 top-1/2 -translate-y-1/2 start-3" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-4 py-2 rounded-xl border border-input text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Channel & Status Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <Filter className="size-3.5 text-muted-foreground shrink-0" />
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl border border-input text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">{t("filterChannel")}</option>
              <option value="whatsapp">{t("channelWhatsApp")}</option>
              <option value="email">{t("channelEmail")}</option>
              <option value="sms">{t("channelSMS")}</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl border border-input text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">{t("filterStatus")}</option>
              <option value="draft">{t("statusDraft")}</option>
              <option value="active">{t("statusActive")}</option>
              <option value="scheduled">{t("statusScheduled")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Cards / Loading / Empty State */}
      {loading ? (
        <div className="db-card p-12 text-center flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/70">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Loading campaigns...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="db-card p-12 text-center flex flex-col items-center justify-center gap-3 rounded-2xl border border-border/70">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <Megaphone className="size-8" />
          </div>
          <h3 className="text-sm font-bold text-foreground">{t("noCampaignsFound")}</h3>
          <p className="text-xs text-muted-foreground max-w-sm">{t("noCampaignsDesc")}</p>
          <button
            onClick={onCreateNewClick}
            className="mt-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            <Plus className="size-4" />
            <span>{t("tabCreateCampaign")}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} onSelect={onSelectCampaign} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {paginationMeta && paginationMeta.last_page > 1 && (
        <div className="db-card p-4 border border-border/70 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground">
            {t("showingResults", {
              current: paginationMeta.current_page,
              totalpages: paginationMeta.last_page,
              total: paginationMeta.total,
            })}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={paginationMeta.current_page <= 1 || loading}
              onClick={() => onPageChange(Math.max(1, paginationMeta.current_page - 1))}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground font-medium hover:bg-muted disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
              <span>{t("pagePrevious")}</span>
            </button>

            <div className="flex items-center gap-1 font-mono font-bold px-2">
              {paginationMeta.current_page} / {paginationMeta.last_page}
            </div>

            <button
              disabled={paginationMeta.current_page >= paginationMeta.last_page || loading}
              onClick={() => onPageChange(Math.min(paginationMeta.last_page, paginationMeta.current_page + 1))}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground font-medium hover:bg-muted disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{t("pageNext")}</span>
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
