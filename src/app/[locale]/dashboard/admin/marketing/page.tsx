import { setRequestLocale } from "next-intl/server";
import { listCampaignsApi } from "@/lib/api";
import type { MarketingCampaignApiItem, PaginationMeta } from "@/lib/api/types";
import MarketingDashboardClient from "./MarketingDashboardClient";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminMarketingPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { page } = await searchParams;
  setRequestLocale(locale);

  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1;

  let initialCampaigns: MarketingCampaignApiItem[] = [];
  let initialMeta: PaginationMeta | null = null;

  try {
    const res = await listCampaignsApi(pageNum);

    if (res.data && Array.isArray(res.data)) {
      initialCampaigns = res.data as MarketingCampaignApiItem[];
    } else if (res.result && Array.isArray((res.result as any).data)) {
      initialCampaigns = (res.result as any).data as MarketingCampaignApiItem[];
    }

    if (res.meta) {
      initialMeta = res.meta as PaginationMeta;
    } else if (res.result && (res.result as any).meta) {
      initialMeta = (res.result as any).meta as PaginationMeta;
    }
  } catch (error) {
    console.error("[AdminMarketingPage SSR Fetch Error]:", error);
  }

  return (
    <MarketingDashboardClient
      initialCampaigns={initialCampaigns}
      initialMeta={initialMeta}
      initialPage={pageNum}
    />
  );
}
