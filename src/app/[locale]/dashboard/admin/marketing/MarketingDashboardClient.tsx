"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Megaphone, Send, Plus } from "lucide-react";
import { listCampaignsApi } from "@/lib/api";
import type { MarketingCampaignApiItem, PaginationMeta } from "@/lib/api/types";
import { cn } from "@/lib/utils";

import { MarketingStatsHeader } from "@/components/admin/marketing/MarketingStatsHeader";
import { CampaignsList } from "@/components/admin/marketing/CampaignsList";
import { CreateCampaignForm } from "@/components/admin/marketing/CreateCampaignForm";
import { BulkDispatchForm } from "@/components/admin/marketing/BulkDispatchForm";
import { CampaignDetailsModal } from "@/components/admin/marketing/CampaignDetailsModal";

interface MarketingDashboardClientProps {
  initialCampaigns: MarketingCampaignApiItem[];
  initialMeta: PaginationMeta | null;
  initialPage: number;
}

export default function MarketingDashboardClient({
  initialCampaigns,
  initialMeta,
  initialPage,
}: MarketingDashboardClientProps) {
  const t = useTranslations("Marketing");

  const [activeTab, setActiveTab] = useState<"campaigns" | "dispatch" | "create">("campaigns");

  // Campaigns & Pagination state
  const [campaigns, setCampaigns] = useState<MarketingCampaignApiItem[]>(initialCampaigns);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(initialMeta);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [loading, setLoading] = useState(false);

  // Selected Campaign for Modal
  const [selectedCampaign, setSelectedCampaign] = useState<MarketingCampaignApiItem | null>(null);

  const fetchCampaigns = async (page = 1) => {
    setLoading(true);
    const res = await listCampaignsApi(page);

    if (res.data && Array.isArray(res.data)) {
      setCampaigns(res.data as MarketingCampaignApiItem[]);
    } else if (res.result && Array.isArray((res.result as any).data)) {
      setCampaigns((res.result as any).data as MarketingCampaignApiItem[]);
    }

    if (res.meta) {
      setPaginationMeta(res.meta as PaginationMeta);
    } else if (res.result && (res.result as any).meta) {
      setPaginationMeta((res.result as any).meta as PaginationMeta);
    }

    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchCampaigns(newPage);
  };

  const handleCampaignCreated = () => {
    fetchCampaigns(currentPage);
    setActiveTab("campaigns");
  };

  // Metrics
  const totalCampaigns = paginationMeta?.total ?? campaigns.length;
  const draftCount = campaigns.filter((c) => (c.status || "draft") === "draft").length;
  const activeCount = campaigns.filter((c) => c.status === "active" || c.status === "scheduled").length;
  const totalSentCount = campaigns.reduce((sum, c) => sum + (c.sent_count || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* KPI Stats & Header */}
      <MarketingStatsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCampaigns={totalCampaigns}
        draftCount={draftCount}
        activeCount={activeCount}
        totalSentCount={totalSentCount}
      />

      {/* Tab Navigation */}
      <div className="flex border-b border-border gap-2 pb-1">
        <button
          onClick={() => setActiveTab("campaigns")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2",
            activeTab === "campaigns"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Megaphone className="size-4" />
          <span>{t("tabCampaigns")}</span>
          <span className="ms-1 px-2 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary font-mono">
            {campaigns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("dispatch")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2",
            activeTab === "dispatch"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Send className="size-4" />
          <span>{t("tabBulkDispatch")}</span>
        </button>

        <button
          onClick={() => setActiveTab("create")}
          className={cn(
            "px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2",
            activeTab === "create"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Plus className="size-4" />
          <span>{t("tabCreateCampaign")}</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === "campaigns" && (
        <CampaignsList
          campaigns={campaigns}
          paginationMeta={paginationMeta}
          loading={loading}
          onSelectCampaign={(c) => setSelectedCampaign(c)}
          onPageChange={handlePageChange}
          onCreateNewClick={() => setActiveTab("create")}
        />
      )}

      {activeTab === "dispatch" && <BulkDispatchForm />}

      {activeTab === "create" && (
        <CreateCampaignForm onSuccess={handleCampaignCreated} />
      )}

      {/* Details Modal */}
      <CampaignDetailsModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </div>
  );
}
